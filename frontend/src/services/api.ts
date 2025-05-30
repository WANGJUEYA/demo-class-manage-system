import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Course {
  id: number;
  course_id: string;
  course_name: string;
  credits: number;
  hours: number;
}

export interface ClassSection {
  id: number;
  section_id: string;
  section_name: string;
  semester: string;
  location: string;
  course: number;
  course_name: string;
}

export interface Student {
  id: number;
  student_id: string;
  name: string;
}

export interface Grade {
  id: number;
  student: number;
  student_name: string;
  class_section: number;
  section_name: string;
  course_name: string;
  score: number;
  created_at: string;
  updated_at: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const courseApi = {
  getAll: () => api.get<Course[]>('/courses/'),
  getById: (id: number) => api.get<Course>(`/courses/${id}/`),
  create: (data: Partial<Course>) => api.post<Course>('/courses/', data),
  update: (id: number, data: Partial<Course>) => api.put<Course>(`/courses/${id}/`, data),
  delete: (id: number) => api.delete(`/courses/${id}/`),
};

export const classSectionApi = {
  getAll: () => api.get<ClassSection[]>('/sections/'),
  getById: (id: number) => api.get<ClassSection>(`/sections/${id}/`),
  create: (data: Partial<ClassSection>) => api.post<ClassSection>('/sections/', data),
  update: (id: number, data: Partial<ClassSection>) => api.put<ClassSection>(`/sections/${id}/`, data),
  delete: (id: number) => api.delete(`/sections/${id}/`),
};

export const studentApi = {
  getAll: () => api.get<Student[]>('/students/'),
  getById: (id: number) => api.get<Student>(`/students/${id}/`),
  create: (data: Partial<Student>) => api.post<Student>('/students/', data),
  update: (id: number, data: Partial<Student>) => api.put<Student>(`/students/${id}/`, data),
  delete: (id: number) => api.delete(`/students/${id}/`),
  getGrades: (id: number) => api.get(`/students/${id}/grades/`),
  enroll: (studentId: number, sectionId: number) => 
    api.post('/students/enroll/', { student: studentId, class_section: sectionId }),
};

export const gradeApi = {
  getAll: () => api.get<Grade[]>('/grades/'),
  getById: (id: number) => api.get<Grade>(`/grades/${id}/`),
  create: (data: Partial<Grade>) => api.post<Grade>('/grades/', data),
  update: (id: number, data: Partial<Grade>) => api.put<Grade>(`/grades/${id}/`, data),
  delete: (id: number) => api.delete(`/grades/${id}/`),
  getSectionGrades: (sectionId: number) => api.get<Grade[]>(`/grades/section_grades/?section=${sectionId}`),
  bulkCreate: (data: Partial<Grade>[]) => api.post('/grades/bulk_create/', data),
}; 