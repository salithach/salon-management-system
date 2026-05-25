# Staff API Integration

## Overview
The staff management system now uses internal API routes that proxy to the backend API. This follows the same pattern as the login/register endpoints.

## Architecture

### 1. API Routes (Next.js)
- **`app/api/staff/route.ts`** - GET all staff & POST create staff
- **`app/api/staff/[id]/route.ts`** - GET single staff, PUT update, DELETE staff

### 2. Service Layer
- **`lib/staffService.ts`** - Client-side service for API calls
  - `getAllStaff()` - Fetch all staff
  - `getStaffById(id)` - Fetch single staff member
  - `createStaff(member)` - Create new staff member
  - `updateStaff(id, updates)` - Update staff member
  - `deleteStaff(id)` - Delete staff member

### 3. Store (Zustand)
- **`store/staffStore.ts`** - Main state management
  - `useStaffStore` - For staff data and operations
  - `useStaffAssignmentStore` - For daily assignments (persisted to localStorage)

### 4. Components
- **`app/dashboard/staff/page.tsx`** - Staff management UI
  - Displays API data
  - Async add/delete operations with error handling

## Data Flow

```
UI Component
    ↓
Zustand Store (useStaffStore)
    ↓
Service Layer (staffService)
    ↓
Next.js API Routes (/api/staff)
    ↓
Backend API (http://localhost:7800/api/v1/staff)
```

## API Routes Details

### Environment Variable Required
```env
API_BASE_URL=http://localhost:7800
```

### Endpoints

#### GET /api/staff
- Proxies to: `GET http://localhost:7800/api/v1/staff`
- Returns: Array of StaffMember objects

#### POST /api/staff
- Proxies to: `POST http://localhost:7800/api/v1/staff`
- Request body: StaffMember (without id)
- Returns: Created StaffMember with id

#### GET /api/staff/[id]
- Proxies to: `GET http://localhost:7800/api/v1/staff/{id}`
- Returns: Single StaffMember object

#### PUT /api/staff/[id]
- Proxies to: `PUT http://localhost:7800/api/v1/staff/{id}`
- Request body: Partial StaffMember
- Returns: Updated StaffMember

#### DELETE /api/staff/[id]
- Proxies to: `DELETE http://localhost:7800/api/v1/staff/{id}`
- Returns: Success response

## Staff Member Type

```typescript
type StaffMember = {
    id: string
    username: string
    name: string
    email: string
    phone: string
    address: string
    role: string
    specialty?: string
    appointments?: number
    rating?: string
    status?: string
}
```

## Error Handling

All API routes include:
- Environment variable validation
- Proper error message extraction
- Status code propagation
- User-friendly error messages

## Usage Example

```typescript
// In a component
import { useStaffStore } from '@/store/staffStore'

function MyComponent() {
    const { staff, loading, error, fetchStaff, createStaff } = useStaffStore()

    useEffect(() => {
        fetchStaff()
    }, [fetchStaff])

    const handleAdd = async () => {
        try {
            await createStaff({
                name: "John Doe",
                username: "johndoe",
                email: "john@salon.com",
                phone: "0777123456",
                address: "Colombo",
                role: "Stylist"
            })
        } catch (error) {
            console.error(error.message)
        }
    }
}
```

