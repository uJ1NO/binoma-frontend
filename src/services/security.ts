import { API_BASE_URL } from '../config';

export interface SecurityCheck {
    id: string;
    type: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    timestamp: string;
    details?: Record<string, any>;
}

export interface SecurityMetrics {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warningChecks: number;
    lastUpdated: string;
}

export class SecurityService {
    static async getSecurityMetrics(): Promise<SecurityMetrics> {
        const response = await fetch(`${API_BASE_URL}/security/metrics`);
        if (!response.ok) {
            throw new Error('Failed to fetch security metrics');
        }
        return response.json();
    }

    static async getSecurityAlerts(): Promise<SecurityCheck[]> {
        const response = await fetch(`${API_BASE_URL}/security/alerts`);
        if (!response.ok) {
            throw new Error('Failed to fetch security alerts');
        }
        return response.json();
    }

    static async getSecurityCheckDetails(id: string): Promise<SecurityCheck> {
        const response = await fetch(`${API_BASE_URL}/security/checks/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch security check details');
        }
        return response.json();
    }
} 