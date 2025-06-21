import api from '../../services/api';
import { getToken } from '../../utils/auth';
import { Draft, Email, CreateDraftRequest, UpdateDraftRequest, SendEmailRequest } from '../types/email';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Draft operations
export const createDraft = async (data: CreateDraftRequest): Promise<Draft> => {
  const response = await api.post('/api/rascunhos', data, {
    headers: getAuthHeaders(),
  });
  return response.data.rascunho;
};

export const updateDraft = async (data: UpdateDraftRequest): Promise<Draft> => {
  const response = await api.put('/api/rascunhos', data, {
    headers: getAuthHeaders(),
  });
  return response.data.rascunho;
};

export const getDrafts = async (): Promise<Draft[]> => {
  const response = await api.get('/api/rascunhos', {
    headers: getAuthHeaders(),
  });
  return response.data.rascunhos;
};

export const getDraft = async (id: number): Promise<Draft> => {
  const response = await api.get(`/api/rascunhos/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.rascunho;
};

export const deleteDraft = async (id: number): Promise<void> => {
  await api.delete(`/api/rascunhos/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Email operations - Updated methods
export const sendEmailFromDraft = async (rascunhoId: number): Promise<Email> => {
  const response = await api.post(`/api/emails/rascunho/${rascunhoId}`, null, {
    headers: getAuthHeaders(),
  });
  return response.data.email;
};

export const sendEmail = async (data: SendEmailRequest): Promise<Email> => {
  const response = await api.post('/api/emails', data, {
    headers: getAuthHeaders(),
  });
  return response.data.email;
};

export const getEmails = async (): Promise<Email[]> => {
  const response = await api.get('/api/emails', {
    headers: getAuthHeaders(),
  });
  return response.data.emails;
};

// Changed from PUT to GET method
export const markEmailAsRead = async (id: number): Promise<Email> => {
  const response = await api.get(`/api/emails/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.email;
};