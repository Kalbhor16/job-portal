const Message = require('../models/Message');
const Job = require('../models/Job');

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, jobId, message } = req.body;

    if (!receiver || !jobId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver, Job ID, and message are required',
      });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      job: jobId,
      message,
    });

    await newMessage.populate('sender', 'name email');
    await newMessage.populate('receiver', 'name email');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

// @route   GET /api/messages/job/:jobId
// @desc    Get all messages for a job conversation
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { jobId } = req.params;

    const messages = await Message.find({ job: jobId })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation with a specific user
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('job', 'title')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message,
    });
  }
};
