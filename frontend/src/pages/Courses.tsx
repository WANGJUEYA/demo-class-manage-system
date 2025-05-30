import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Course, courseApi } from '../services/api';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    credits: '',
    hours: '',
  });

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpen = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_id: course.course_id,
        course_name: course.course_name,
        credits: course.credits.toString(),
        hours: course.hours.toString(),
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_id: '',
        course_name: '',
        credits: '',
        hours: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        credits: parseFloat(formData.credits),
        hours: parseInt(formData.hours),
      };

      if (editingCourse?.id) {
        await courseApi.update(editingCourse.id, data);
      } else {
        await courseApi.create(data);
      }

      handleClose();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这门课程吗？')) {
      try {
        await courseApi.delete(id);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          添加课程
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>课程号</TableCell>
              <TableCell>课程名</TableCell>
              <TableCell>学分</TableCell>
              <TableCell>学时</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.course_id}</TableCell>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.hours}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCourse ? '编辑课程' : '添加课程'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="课程号"
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              fullWidth
            />
            <TextField
              label="课程名"
              value={formData.course_name}
              onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="学分"
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              fullWidth
            />
            <TextField
              label="学时"
              type="number"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses; 