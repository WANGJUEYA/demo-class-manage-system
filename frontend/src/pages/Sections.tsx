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
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { ClassSection, Course, classSectionApi, courseApi } from '../services/api';

const Sections: React.FC = () => {
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<ClassSection> | null>(null);
  const [formData, setFormData] = useState({
    section_id: '',
    section_name: '',
    semester: '',
    location: '',
    course: '',
  });

  const fetchSections = async () => {
    try {
      const response = await classSectionApi.getAll();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchCourses();
  }, []);

  const handleOpen = (section?: ClassSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        section_id: section.section_id,
        section_name: section.section_name,
        semester: section.semester,
        location: section.location,
        course: section.course.toString(),
      });
    } else {
      setEditingSection(null);
      setFormData({
        section_id: '',
        section_name: '',
        semester: '',
        location: '',
        course: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSection(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        course: parseInt(formData.course),
      };

      if (editingSection?.id) {
        await classSectionApi.update(editingSection.id, data);
      } else {
        await classSectionApi.create(data);
      }

      handleClose();
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个班次吗？')) {
      try {
        await classSectionApi.delete(id);
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
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
          添加班次
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>班次号</TableCell>
              <TableCell>班次名</TableCell>
              <TableCell>学期</TableCell>
              <TableCell>地点</TableCell>
              <TableCell>课程</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.section_id}</TableCell>
                <TableCell>{section.section_name}</TableCell>
                <TableCell>{section.semester}</TableCell>
                <TableCell>{section.location}</TableCell>
                <TableCell>{section.course_name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(section)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(section.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingSection ? '编辑班次' : '添加班次'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="班次号"
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              fullWidth
            />
            <TextField
              label="班次名"
              value={formData.section_name}
              onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
              fullWidth
            />
            <TextField
              label="学期"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              fullWidth
            />
            <TextField
              label="地点"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="课程"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              fullWidth
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.course_name}
                </MenuItem>
              ))}
            </TextField>
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

export default Sections; 