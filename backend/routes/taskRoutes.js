import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to ALL task routes
router.use(authMiddleware);

// ✅ CREATE Task (User-specific)
router.post("/", async (req, res) => {
  try {
    // Add userId from authenticated user to task data
    const taskData = {
      ...req.body,
      userId: req.user.id
    };
    
    const newTask = await Task.create(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all tasks with filtering (User-specific only)
router.get("/", async (req, res) => {
  try {
    // Build query object starting with userId
    const query = { userId: req.user.id };
    
    // Filter by status (todo, inprogress, completed)
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by priority (low, medium, high)
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    // Filter by draft status
    if (req.query.isDraft !== undefined) {
      query.isDraft = req.query.isDraft === 'true';
    }
    
    // Filter by date range
    if (req.query.dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (req.query.dateFilter) {
        case 'today':
          // Tasks due today
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query.dueDate = {
            $gte: today,
            $lt: tomorrow
          };
          break;
          
        case 'upcoming':
          // Tasks due after today
          query.dueDate = { $gt: today };
          break;
          
        case 'overdue':
          // Tasks due before today and not completed
          query.dueDate = { $lt: today };
          query.status = { $ne: 'completed' };
          break;
      }
    }
    
    // Text search in title and description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'dueDate':
          sortOption = { dueDate: req.query.sortOrder === 'desc' ? -1 : 1 };
          break;
        case 'priority':
          // Sort by priorityValue (high=3, medium=2, low=1)
          sortOption = { priorityValue: req.query.sortOrder === 'desc' ? -1 : 1 };
          break;
        case 'title':
          sortOption = { title: req.query.sortOrder === 'desc' ? -1 : 1 };
          break;
        case 'createdAt':
          sortOption = { createdAt: req.query.sortOrder === 'desc' ? -1 : 1 };
          break;
      }
    }
    
    // Execute query with pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default: return all
    const skip = (page - 1) * limit;
    
    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Task.countDocuments(query);
    
    res.status(200).json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});


// ✅ UPDATE Task (User-specific)
router.put("/:id", async (req, res) => {
  try {
    // First, verify task belongs to authenticated user
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ 
        message: "Task not found or you don't have permission to update it" 
      });
    }
    
    // Update task (prevent userId from being changed)
    const { userId, ...updateData } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE Task (User-specific)
router.delete("/:id", async (req, res) => {
  try {
    // Only delete if task belongs to authenticated user
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ 
        message: "Task not found or you don't have permission to delete it" 
      });
    }
    
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
