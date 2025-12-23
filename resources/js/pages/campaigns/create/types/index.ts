import type { EmailTemplate, Recipient } from '@/types';

export interface CreatePageProps {
    templates: EmailTemplate[];
    recipients: Recipient[];
}
