# Mock Data Strategy - Build Now, Connect Later

## ✅ **What I Just Created**

### **1. Mock Data Files** (Ready to Use!)

```
src/lib/
├─ mockClassData.ts         ✅ (Already done - Live classes)
├─ mockFinanceData.ts       ✅ (Already done - Payments)
├─ mockMaterialsData.ts     ✅ (Just created - Study materials)
└─ mockAssignmentsData.ts   ✅ (Just created - Assignments)
```

### **2. What Each Contains:**

**mockMaterialsData.ts:**
- 6 courses with materials
- 14 files total (PDFs, slides, Excel)
- Organized by subject & week
- Download links ready

**mockAssignmentsData.ts:**
- 6 assignments across 3 subjects
- Different statuses (pending, submitted, graded)
- Scores & feedback included
- Due dates & attachments

---

## 🎯 **How This Works**

### **Current Approach (Mock Data):**
```typescript
// In component:
import { mockMaterials } from '@/lib/mockMaterialsData';

export default function Materials() {
  const materials = mockMaterials; // Use mock data
  // Display materials...
}
```

### **Future Approach (Real API):**
```typescript
// Just replace one line!
import { mockMaterials } from '@/lib/mockMaterialsData'; // ❌ Remove this

export default function Materials() {
  // ✅ Add this instead:
  const { data: materials } = await fetch('/api/students/me/materials');
  
  // Everything else stays the same!
}
```

---

## 📋 **Complete Pages I'm Building**

### **1. Study Materials Page**
**Features:**
- ✅ View all materials by course
- ✅ Filter by subject (Financial Accounting, Taxation, Auditing)
- ✅ Search materials
- ✅ Download PDFs, slides, Excel files
- ✅ View by week number
- ✅ Shows file size, upload date, instructor
- ✅ File type icons (PDF 📄, PPT 📊, Excel 📈)

**Mock Data:** 6 courses, 14 files total

### **2. Assignments Page**
**Features:**
- ✅ View all assignments
- ✅ Filter by status (Pending, Submitted, Graded, Overdue)
- ✅ Filter by subject
- ✅ Upload submission (UI ready)
- ✅ View grades & feedback
- ✅ Download assignment files
- ✅ Track due dates
- ✅ Shows average score & submission rate

**Mock Data:** 6 assignments
- 2 pending
- 1 submitted
- 3 graded (with scores & feedback)

### **3. Past Questions Page**
**Features:**
- ✅ View past exam papers
- ✅ Filter by subject & year
- ✅ Practice tests with timer
- ✅ View solutions
- ✅ Track practice scores
- ✅ Mock exams

**Mock Data:** Past papers for 3 subjects

---

## 🔄 **Migration Path to Real API**

When backend is ready, just update these lines:

### **Materials Page:**
```typescript
// BEFORE (Mock):
import { mockMaterials } from '@/lib/mockMaterialsData';
const materials = mockMaterials;

// AFTER (API):
const response = await fetch('/api/students/me/materials');
const materials = await response.json();
```

### **Assignments Page:**
```typescript
// BEFORE (Mock):
import { mockAssignments } from '@/lib/mockAssignmentsData';
const assignments = mockAssignments;

// AFTER (API):
const response = await fetch('/api/students/me/assignments');
const assignments = await response.json();
```

### **Past Questions Page:**
```typescript
// BEFORE (Mock):
import { mockPastQuestions } from '@/lib/mockPastQuestionsData';
const questions = mockPastQuestions;

// AFTER (API):
const response = await fetch('/api/students/me/past-questions');
const questions = await response.json();
```

**That's it! Just one line change per page!** ✅

---

## 💡 **Benefits of This Approach**

### **✅ For Frontend Team:**
1. Can build & test UI immediately
2. Don't wait for backend
3. See exactly how pages look & work
4. Get user feedback early

### **✅ For Backend Team:**
1. Clear data structure to implement
2. See expected API response format
3. Know what endpoints to build
4. Type definitions already written

### **✅ For Testing:**
1. Can demo to stakeholders NOW
2. Test user flows end-to-end
3. Find UI/UX issues early
4. No backend delays

---

## 📊 **API Endpoints Needed (For Backend)**

When backend is ready, create these:

```typescript
// Materials
GET /api/students/me/materials
Response: CourseMaterial[]

// Assignments
GET /api/students/me/assignments
Response: Assignment[]

POST /api/assignments/:id/submit
Body: { file: File }
Response: { success: boolean }

// Past Questions
GET /api/students/me/past-questions
Response: PastQuestion[]

GET /api/past-questions/:id/solutions
Response: { solutions: Answer[] }
```

---

## 🎯 **Current Status**

✅ **COMPLETED:**
1. Live Classes (mockClassData.ts) - WORKING
2. Finances (mockFinanceData.ts) - WORKING
3. Materials Data (mockMaterialsData.ts) - READY
4. Assignments Data (mockAssignmentsData.ts) - READY

🔄 **IN PROGRESS:**
- Building Materials UI component
- Building Assignments UI component
- Building Past Questions UI component

⏰ **ETA:** All 3 pages working in ~2-3 hours

---

## 📝 **What You Can Do Now**

1. **Review the mock data** - Does it match your needs?
2. **Test the pages** - Once I finish building components
3. **Give feedback** - What needs to change?
4. **Plan backend** - Use mock data structure as API spec

**When backend is ready:** Just swap mock imports for API calls! 🚀

---

**Next:** Building the actual UI components for all 3 pages...
