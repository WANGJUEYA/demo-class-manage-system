from rest_framework import serializers
from .models import Course, ClassSection, Student, Grade

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_id', 'course_name', 'credits', 'hours']

class ClassSectionSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    
    class Meta:
        model = ClassSection
        fields = ['id', 'section_id', 'section_name', 'semester', 'location', 'course', 'course_name']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name']

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    section_name = serializers.CharField(source='class_section.section_name', read_only=True)
    course_name = serializers.CharField(source='class_section.course.course_name', read_only=True)
    
    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'class_section', 'section_name', 
                 'course_name', 'score', 'created_at', 'updated_at']

class StudentGradeReportSerializer(serializers.ModelSerializer):
    grades = GradeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'grades'] 