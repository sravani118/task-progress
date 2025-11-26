import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["todo", "inprogress", "completed"],
    default: "todo",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  priorityValue: {
    type: Number,
    default: function() {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[this.priority] || 2;
    }
  },
  dueDate: Date,
  isDraft: { type: Boolean, default: false },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

// Update priorityValue whenever priority changes
taskSchema.pre('save', function(next) {
  const priorityMap = { high: 3, medium: 2, low: 1 };
  this.priorityValue = priorityMap[this.priority] || 2;
  next();
});

// Add index for efficient querying by user
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model("Task", taskSchema);
