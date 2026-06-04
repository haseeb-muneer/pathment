import { apiClient } from './api-client';

export const taskApi = {
  // Mentee APIs
  getMenteeTasks: (menteeId: string, params?: { status?: string; enrollmentId?: string }) =>
    apiClient.get(`/tasks/mentee/${menteeId}`, { params }),

  getMenteeTaskStats: (menteeId: string, enrollmentId?: string) =>
    apiClient.get(`/tasks/mentee/${menteeId}/stats`, { params: { enrollmentId } }),

  getTaskById: (taskId: string) =>
    apiClient.get(`/tasks/${taskId}`),

  submitTask: (taskId: string, data: { submissionText: string; submissionUrls?: string[] }) =>
    apiClient.post(`/tasks/${taskId}/submit`, data),

  updateTaskStatus: (taskId: string, status: string) =>
    apiClient.patch(`/tasks/${taskId}/status`, { status }),

  // Mentor APIs
  getMentorTasks: (mentorId: string, params?: { 
    status?: string; 
    enrollmentId?: string; 
    menteeId?: string;
    pendingReview?: boolean;
  }) =>
    apiClient.get(`/tasks/mentor/${mentorId}`, { params }),

  getMentorTaskStats: (mentorId: string) =>
    apiClient.get(`/tasks/mentor/${mentorId}/stats`),

   createCustomTask: (data: {
    menteeId: string;
    enrollmentId: string;
    roadmapTaskId?: string;
    title?: string;
    description?: string;
    type?: string;
    difficulty?: string;
    dueDate?: string;
    pointsBase?: number;
    deliverable?: string;
    acceptanceCriteria?: string[];
    files?: File[];
  }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files') return;
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

       data.files?.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient.post('/tasks/custom', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  reviewTask: (taskId: string, data: {
    rating: number;
    feedback: string;
    status: 'completed' | 'revision_needed';
    pointsAwarded?: number;
  }) =>
    apiClient.post(`/tasks/${taskId}/review`, data),

  cancelTask: (taskId: string, reason?: string) =>
    apiClient.post(`/tasks/${taskId}/cancel`, { reason }),

  deleteCustomTask: (taskId: string) =>
    apiClient.delete(`/tasks/${taskId}`),

  // Roadmap APIs
  getRoadmapTasks: (programId: string, levelId: string, menteeId?: string) =>
    apiClient.get(`/tasks/roadmap/program/${programId}/level/${levelId}`, {
      params: menteeId ? { menteeId } : undefined
    }),

  // Admin APIs
  autoAssignWeekTasks: (enrollmentId: string, weekNumber: number) =>
    apiClient.post('/tasks/auto-assign', { enrollmentId, weekNumber })
};

export default taskApi;
