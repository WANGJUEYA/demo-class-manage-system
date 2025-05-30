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
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Student,
  ClassSection,
  studentApi,
  classSectionApi,
} from '../services/api';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [open, setOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
  });

  const fetchStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await classSectionApi.getAll();
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSections();
  }, []);

  const handleOpen = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        student_id: student.student_id,
        name: student.name,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        student_id: '',
        name: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStudent(null);
  };

  const handleEnrollOpen = (student: Student) => {
    setSelectedStudent(student);
    setSelectedSection('');
    setEnrollOpen(true);
  };

  const handleEnrollClose = () => {
    setEnrollOpen(false);
    setSelectedStudent(null);
    setSelectedSection('');
  };

  const handleSubmit = async () => {
    try {
      if (editingStudent?.id) {
        await studentApi.update(editingStudent.id, formData);
      } else {
        await studentApi.create(formData);
      }

      handleClose();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEnroll = async () => {
    if (selectedStudent && selectedSection) {
      try {
        await studentApi.enroll(selectedStudent.id, parseInt(selectedSection));
        handleEnrollClose();
        fetchStudents();
      } catch (error) {
        console.error('Error enrolling student:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个学生吗？')) {
      try {
        await studentApi.delete(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
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
          添加学生
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>学号</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.student_id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEnrollOpen(student)}>
                    <SchoolIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingStudent ? '编辑学生' : '添加学生'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="学号"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              fullWidth
            />
            <TextField
              label="姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

      <Dialog open={enrollOpen} onClose={handleEnrollClose}>
        <DialogTitle>选课</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedStudent && (
              <Chip
                label={`${selectedStudent.name} (${selectedStudent.student_id})`}
                color="primary"
              />
            )}
            <FormControl fullWidth>
              <InputLabel>班次</InputLabel>
              <Select
                value={selectedSection}
                label="班次"
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.course_name} - {section.section_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEnrollClose}>取消</Button>
          <Button onClick={handleEnroll} variant="contained">
            确认选课
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students; 