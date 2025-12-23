<?php

namespace Database\Seeders;

use App\Models\FormTemplate;
use Illuminate\Database\Seeder;

class FormTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generic Social Media Login Template
        FormTemplate::create([
            'name' => 'Generic Social Media Login',
            'description' => 'Simple social media style login page for phishing simulation',
            'html_content' => $this->getSocialMediaTemplate(),
            'target_url' => null,
            'capture_route' => '/phishing/capture',
            'metadata' => [
                'brand' => 'SocialApp',
                'color' => '#1877f2',
                'type' => 'social-media',
            ],
            'is_active' => true,
        ]);

        // Generic Email Login Template
        FormTemplate::create([
            'name' => 'Generic Email Login',
            'description' => 'Email service style login page',
            'html_content' => $this->getEmailTemplate(),
            'target_url' => null,
            'capture_route' => '/phishing/capture',
            'metadata' => [
                'brand' => 'MailService',
                'color' => '#ea4335',
                'type' => 'email',
            ],
            'is_active' => true,
        ]);

        // Generic Banking Login Template
        FormTemplate::create([
            'name' => 'Generic Banking Login',
            'description' => 'Banking style login page with security emphasis',
            'html_content' => $this->getBankingTemplate(),
            'target_url' => null,
            'capture_route' => '/phishing/capture',
            'metadata' => [
                'brand' => 'SecureBank',
                'color' => '#003087',
                'type' => 'banking',
            ],
            'is_active' => true,
        ]);
    }

    protected function getSocialMediaTemplate(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SocialApp</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f0f2f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .logo { text-align: center; color: #1877f2; font-size: 48px; font-weight: bold; margin-bottom: 20px; }
        h2 { text-align: center; color: #1c1e21; margin-bottom: 20px; font-size: 24px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; margin-bottom: 6px; color: #606770; font-size: 14px; font-weight: 500; }
        input { width: 100%; padding: 12px; border: 1px solid #dddfe2; border-radius: 6px; font-size: 15px; }
        input:focus { outline: none; border-color: #1877f2; box-shadow: 0 0 0 2px rgba(24,119,242,0.1); }
        button { width: 100%; padding: 14px; background: #1877f2; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 16px; }
        button:hover { background: #166fe5; }
        .footer { text-align: center; margin-top: 20px; font-size: 13px; color: #8a8d91; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">SA</div>
        <h2>Log In to SocialApp</h2>
        <form action="/submit" method="POST">
            <div class="form-group">
                <label for="email">Email or Phone</label>
                <input type="text" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Log In</button>
        </form>
        <div class="footer">
            <p>Forgot password? • Sign up for SocialApp</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    protected function getEmailTemplate(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in - MailService</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Google Sans', Roboto, Arial, sans-serif; background: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .container { width: 100%; max-width: 450px; padding: 48px 40px 36px; border: 1px solid #dadce0; border-radius: 8px; }
        .logo { text-align: center; margin-bottom: 16px; }
        .logo-text { font-size: 24px; color: #ea4335; font-weight: 400; }
        h1 { text-align: center; font-size: 24px; font-weight: 400; color: #202124; margin-bottom: 8px; }
        .subtitle { text-align: center; color: #5f6368; font-size: 16px; margin-bottom: 32px; }
        .form-group { margin-bottom: 24px; }
        label { display: block; margin-bottom: 8px; color: #5f6368; font-size: 14px; }
        input { width: 100%; padding: 14px 16px; border: 1px solid #dadce0; border-radius: 4px; font-size: 16px; }
        input:focus { outline: none; border-color: #1a73e8; border-width: 2px; }
        .button-container { display: flex; justify-content: flex-end; margin-top: 32px; }
        button { padding: 10px 24px; background: #1a73e8; color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; }
        button:hover { background: #1765cc; box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15); }
        .footer { text-align: center; margin-top: 24px; }
        .footer a { color: #1a73e8; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-text">📧 MailService</div>
        </div>
        <h1>Sign in</h1>
        <p class="subtitle">to continue to Mail</p>
        <form action="/submit" method="POST">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Enter your password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="button-container">
                <button type="submit">Next</button>
            </div>
        </form>
        <div class="footer">
            <a href="#">Forgot password?</a>
        </div>
    </div>
</body>
</html>
HTML;
    }

    protected function getBankingTemplate(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Login - SecureBank</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .container { background: white; padding: 48px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 100%; max-width: 450px; }
        .header { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 36px; color: #003087; font-weight: bold; margin-bottom: 8px; }
        .tagline { color: #666; font-size: 14px; }
        .security-badge { background: #e8f5e9; color: #2e7d32; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; margin-bottom: 24px; }
        h2 { color: #003087; margin-bottom: 24px; font-size: 22px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #333; font-size: 14px; font-weight: 600; }
        input { width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 15px; }
        input:focus { outline: none; border-color: #003087; }
        .remember { display: flex; align-items: center; margin: 16px 0; }
        .remember input { width: auto; margin-right: 8px; }
        .remember label { margin: 0; font-weight: normal; }
        button { width: 100%; padding: 16px; background: #003087; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
        button:hover { background: #002d6b; }
        .links { text-align: center; margin-top: 24px; }
        .links a { color: #003087; text-decoration: none; font-size: 14px; display: block; margin: 8px 0; }
        .security-notice { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-top: 24px; font-size: 13px; color: #856404; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏦 SecureBank</div>
            <div class="tagline">Banking with Confidence</div>
        </div>
        <div style="text-align: center;">
            <span class="security-badge">🔒 Secure Connection</span>
        </div>
        <h2>Online Banking Login</h2>
        <form action="/submit" method="POST">
            <div class="form-group">
                <label for="username">User ID</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="remember">
                <input type="checkbox" id="remember" name="remember">
                <label for="remember">Remember User ID</label>
            </div>
            <button type="submit">Secure Log In</button>
        </form>
        <div class="links">
            <a href="#">Forgot User ID or Password?</a>
            <a href="#">Enroll in Online Banking</a>
        </div>
        <div class="security-notice">
            <strong>Security Notice:</strong> Never share your password with anyone.
        </div>
    </div>
</body>
</html>
HTML;
    }
}
