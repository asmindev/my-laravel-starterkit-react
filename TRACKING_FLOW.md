# Tracking & Phishing Flow Documentation

## 📊 Unified Tracking System

Sistem tracking telah **disederhanakan** menjadi satu endpoint yang intelligent dan fleksibel.

---

## 🔄 Flow Diagram (Simplified)

```
📧 Email Sent
    ↓
👤 User clicks ANY link in email
    ↓
🔍 Track Click Endpoint (/campaigns/{campaign}/track/{recipient}/click)
    ↓
    ├─ Track click event (clicked_at timestamp)
    ↓
    ├─ Decision: Where to redirect?
    │
    ├─── [Priority 1] Form Template exists?
    │         ↓ YES
    │         └─→ Redirect to Phishing Simulation Form
    │
    ├─── [Priority 2] Campaign has redirect_url?
    │         ↓ YES
    │         └─→ Redirect to Custom URL
    │
    └─── [Priority 3] No destination configured
              ↓
              └─→ Show 404 Error
```

---

## 🎯 How It Works

### 1. Email Template Setup

When creating a campaign, you have **2 options**:

#### Option A: Manual Placeholder (Recommended)

```html
<p>Halo, {{recipient_name}}!</p>
<p>Klik link berikut untuk verifikasi akun Anda:</p>
<a href="{{PHISHING_LINK}}">Verifikasi Sekarang</a>
```

Placeholders yang didukung:

- `{{PHISHING_LINK}}`
- `{{LINK}}`
- `{{URL}}`

#### Option B: Auto-Inject Button

Jika **tidak ada placeholder**, sistem akan otomatis menambahkan tombol di bawah email:

```html
<!-- Your email content -->
<!-- Auto-injected button: -->
<div style="...">
    <a href="[tracking-url]">Klik Di Sini</a>
</div>
```

---

### 2. Campaign Configuration

#### Scenario A: Phishing Simulation (With Form)

```php
Campaign::create([
    'name' => 'Test Phishing Email',
    'email_template_id' => 1,
    'form_template_id' => 2,  // ✅ Set this
    'track_click' => true,
    // redirect_url can be null
]);
```

**Result:** All links → Track Click → Phishing Form

---

#### Scenario B: Regular Campaign (No Form)

```php
Campaign::create([
    'name' => 'Newsletter Campaign',
    'email_template_id' => 1,
    'form_template_id' => null,  // ❌ No form
    'redirect_url' => 'https://example.com/landing',  // ✅ Set fallback
    'track_click' => true,
]);
```

**Result:** All links → Track Click → Custom URL

---

#### Scenario C: Error (No Destination)

```php
Campaign::create([
    'name' => 'Broken Campaign',
    'email_template_id' => 1,
    'form_template_id' => null,  // ❌ No form
    'redirect_url' => null,       // ❌ No redirect
    'track_click' => true,
]);
```

**Result:** All links → Track Click → 404 Error

---

## 🔧 Backend Logic

### CampaignTrackingController@trackClick

```php
public function trackClick(Campaign $campaign, Recipient $recipient)
{
    // 1. Find campaign recipient record
    $campaignRecipient = $campaign->recipients()
        ->wherePivot('recipient_id', $recipient->id)
        ->firstOrFail();

    // 2. Update clicked_at timestamp (tracking)
    $campaignRecipient->pivot->update(['clicked_at' => now()]);

    // 3. Intelligent redirect
    if ($campaign->formTemplate) {
        // Priority 1: Phishing form
        return redirect()->route('public.phishing-page', [
            'template' => $campaign->formTemplate->id,
            'token' => $campaignRecipient->pivot->tracking_token,
        ]);
    }

    if ($campaign->redirect_url) {
        // Priority 2: Custom URL
        return redirect()->away($campaign->redirect_url);
    }

    // Priority 3: No destination
    abort(404, 'No destination configured for this campaign.');
}
```

---

## 📈 Benefits of Unified System

| Feature            | Before                                       | After                                |
| ------------------ | -------------------------------------------- | ------------------------------------ |
| **Endpoints**      | 2 separate (track-click + phishing-page)     | 1 unified (track-click)              |
| **Email Template** | Need different URLs for tracking vs phishing | Single placeholder for all scenarios |
| **Click Tracking** | Manual implementation per route              | Automatic for all links              |
| **Flexibility**    | Hard-coded behavior                          | Priority-based decision tree         |
| **Analytics**      | Fragmented data                              | Centralized tracking point           |

---

## 🧪 Testing Scenarios

### Test 1: Phishing Campaign

```bash
# Create campaign with form template
php artisan tinker
> $campaign = Campaign::first();
> $recipient = Recipient::first();
> $url = route('campaigns.track-click', ['campaign' => $campaign->id, 'recipient' => $recipient->id]);
> echo $url;

# Click the URL → Should redirect to phishing form
```

### Test 2: Regular Campaign

```bash
# Create campaign WITHOUT form template, WITH redirect_url
> $campaign->update(['form_template_id' => null, 'redirect_url' => 'https://google.com']);
> $url = route('campaigns.track-click', ['campaign' => $campaign->id, 'recipient' => $recipient->id]);

# Click the URL → Should redirect to google.com
```

### Test 3: Broken Campaign

```bash
# Create campaign WITHOUT form AND redirect
> $campaign->update(['form_template_id' => null, 'redirect_url' => null]);
> $url = route('campaigns.track-click', ['campaign' => $campaign->id, 'recipient' => $recipient->id]);

# Click the URL → Should show 404 error
```

---

## 🔒 Security Notes

1. **Tracking Token**: Each recipient gets unique token in `campaign_recipients.tracking_token`
2. **CSRF Exemption**: Public routes (`public.phishing-page`, `phishing.submit`) excluded from CSRF
3. **Encryption**: Form submissions encrypted with `Crypt::encryptString()`
4. **Rate Limiting**: Apply rate limiting to prevent abuse

---

## 📝 Admin Guidelines

### When Creating a Campaign:

1. **For Phishing Education:**
    - ✅ Set `form_template_id`
    - ✅ Use placeholder `{{PHISHING_LINK}}` in email
    - ⚠️ `redirect_url` optional (fallback only)

2. **For Regular Campaigns:**
    - ❌ Leave `form_template_id` null
    - ✅ Set `redirect_url` for destination
    - ✅ Use placeholder `{{LINK}}` in email

3. **For Maximum Flexibility:**
    - Set both `form_template_id` AND `redirect_url`
    - Form template takes priority
    - Redirect URL used as fallback if form disabled later

---

## 🎓 Educational Impact

After user submits phishing form:

1. ✅ Data saved (encrypted)
2. 🚨 Redirect to awareness page (`/phishing/awareness`)
3. 📊 Show statistics and education content
4. ✔️ User acknowledges learning

Complete educational cycle! 🎉
