from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Course, ClassSection, Student, Grade
from .serializers import (
    CourseSerializer, ClassSectionSerializer, StudentSerializer,
    GradeSerializer, StudentGradeReportSerializer
)

# Create your views here.

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        course_name = self.request.query_params.get('course_name', None)
        
        if course_id:
            queryset = queryset.filter(course_id__icontains=course_id)
        if course_name:
            queryset = queryset.filter(course_name__icontains=course_name)
            
        return queryset

class ClassSectionViewSet(viewsets.ModelViewSet):
    queryset = ClassSection.objects.all()
    serializer_class = ClassSectionSerializer
    
    def get_queryset(self):
        queryset = ClassSection.objects.all()
        course = self.request.query_params.get('course', None)
        semester = self.request.query_params.get('semester', None)
        
        if course:
            queryset = queryset.filter(
                Q(course__course_id__icontains=course) |
                Q(course__course_name__icontains=course)
            )
        if semester:
            queryset = queryset.filter(semester__icontains=semester)
            
        return queryset

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    @action(detail=True, methods=['get'])
    def grades(self, request, pk=None):
        student = self.get_object()
        serializer = StudentGradeReportSerializer(student)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def enroll(self, request):
        student_id = request.data.get('student')
        section_id = request.data.get('class_section')
        
        try:
            student = Student.objects.get(id=student_id)
            section = ClassSection.objects.get(id=section_id)
            student.class_sections.add(section)
            return Response({'message': 'Student enrolled successfully'})
        except (Student.DoesNotExist, ClassSection.DoesNotExist):
            return Response(
                {'error': 'Student or Class Section not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    
    @action(detail=False, methods=['get'])
    def section_grades(self, request):
        section_id = request.query_params.get('section', None)
        if not section_id:
            return Response(
                {'error': 'Section ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        grades = Grade.objects.filter(class_section_id=section_id)
        serializer = self.get_serializer(grades, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        grades_data = request.data
        serializer = self.get_serializer(data=grades_data, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
