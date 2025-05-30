from django.db import models

# Create your models here.

class Course(models.Model):
    course_id = models.CharField(max_length=20, unique=True)
    course_name = models.CharField(max_length=100)
    credits = models.DecimalField(max_digits=3, decimal_places=1)
    hours = models.IntegerField()
    
    def __str__(self):
        return f"{self.course_id} - {self.course_name}"

class ClassSection(models.Model):
    section_id = models.CharField(max_length=20, unique=True)
    section_name = models.CharField(max_length=100)
    semester = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sections')
    
    def __str__(self):
        return f"{self.section_name} ({self.course.course_name})"

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    class_sections = models.ManyToManyField(ClassSection, related_name='students')
    
    def __str__(self):
        return f"{self.student_id} - {self.name}"

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    class_section = models.ForeignKey(ClassSection, on_delete=models.CASCADE, related_name='grades')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'class_section')
    
    def __str__(self):
        return f"{self.student.name} - {self.class_section.section_name} - {self.score}"
