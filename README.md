# 成绩管理系统

这是一个使用 Django + React 构建的成绩管理系统，采用前后端分离架构。

## 项目结构

```
demo-class-manage-system/
├── backend/                # Django 后端
│   ├── class_api/         # API 应用
│   ├── class_management/  # 项目配置
│   ├── requirements.txt   # Python 依赖
│   └── manage.py         
└── frontend/              # React 前端
    ├── src/              
    ├── package.json      
    └── pnpm-lock.yaml    
```

## 环境要求

- Python 3.8+
- Node.js 16+
- pnpm 8+

## 启动项目

### 后端启动 (使用 venv)

1. 创建并激活虚拟环境：

```bash
# Windows
cd backend
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
cd backend
python3 -m venv venv
source venv/bin/activate
```

2. 安装依赖：

```bash
pip install -r requirements.txt
```

3. 执行数据库迁移：

```bash
python manage.py makemigrations
python manage.py migrate
```

4. 启动开发服务器：

```bash
python manage.py runserver
```

后端服务将在 http://localhost:8000 运行

### 前端启动 (使用 pnpm)

1. 安装依赖：

```bash
cd frontend
pnpm install
```

2. 启动开发服务器：

```bash
pnpm start
```

前端服务将在 http://localhost:3000 运行

## 开发新模块指南

### 1. 数据库设计

1. 在 `backend/class_api/models.py` 中创建新的模型：

```python
from django.db import models

class YourModel(models.Model):
    field1 = models.CharField(max_length=100)
    field2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'your_table_name'
```

2. 创建并应用迁移：

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. 后端开发

1. 创建序列化器 (`backend/class_api/serializers.py`):

```python
from rest_framework import serializers
from .models import YourModel

class YourModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = YourModel
        fields = '__all__'
```

2. 创建视图 (`backend/class_api/views.py`):

```python
from rest_framework import viewsets
from .models import YourModel
from .serializers import YourModelSerializer

class YourModelViewSet(viewsets.ModelViewSet):
    queryset = YourModel.objects.all()
    serializer_class = YourModelSerializer
```

3. 配置 URL (`backend/class_api/urls.py`):

```python
from rest_framework.routers import DefaultRouter
from .views import YourModelViewSet

router = DefaultRouter()
router.register(r'your-models', YourModelViewSet)
urlpatterns = router.urls
```

### 3. 前端开发

1. 创建 API 服务 (`frontend/src/services/yourModel.ts`):

```typescript
import { api } from './api';

export interface YourModel {
  id: number;
  field1: string;
  field2: number;
  created_at: string;
}

export const yourModelApi = {
  getAll: () => api.get<YourModel[]>('/your-models/'),
  getById: (id: number) => api.get<YourModel>(`/your-models/${id}/`),
  create: (data: Partial<YourModel>) => api.post('/your-models/', data),
  update: (id: number, data: Partial<YourModel>) => 
    api.put(`/your-models/${id}/`, data),
  delete: (id: number) => api.delete(`/your-models/${id}/`),
};
```

2. 创建组件 (`frontend/src/pages/YourModel.tsx`):

```typescript
import React, { useState, useEffect } from 'react';
import { YourModel, yourModelApi } from '../services/yourModel';

const YourModelPage: React.FC = () => {
  const [items, setItems] = useState<YourModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await yourModelApi.getAll();
      setItems(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* 你的组件内容 */}
    </div>
  );
};

export default YourModelPage;
```

3. 添加路由 (`frontend/src/App.tsx`):

```typescript
import YourModelPage from './pages/YourModel';

// 在路由配置中添加
<Route path="/your-models" element={<YourModelPage />} />
```

4. 添加导航菜单 (`frontend/src/components/Layout.tsx`):

```typescript
const menuItems = [
  // ... 其他菜单项
  {
    text: '你的模块',
    icon: <YourIcon />,
    path: '/your-models',
  },
];
```

## API 文档

后端 API 文档可以通过访问以下地址查看：
- http://localhost:8000/api/ (API 根目录)
- http://localhost:8000/api/schema/ (API Schema)

## 开发建议

1. 遵循 RESTful API 设计规范
2. 使用 TypeScript 类型检查
3. 保持代码风格一致
4. 编写必要的注释和文档
5. 定期进行代码审查 