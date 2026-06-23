const { findUserById } = require('../models/user.model');
const {
  getAllMembers, getMemberById, getMemberByUserId,
  createMember, updateMember, deleteMember
} = require('../models/member.model');

// GET /api/members
// Librarian/Admin only - view all members
async function listMembers(req, res) {
  try {
    const members = await getAllMembers();
    return res.json({ members });
  } catch (err) {
    console.error('List members error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching members' });
  }
}

// GET /api/members/:id
async function getMember(req, res) {
  try {
    const member = await getMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    return res.json({ member });
  } catch (err) {
    console.error('Get member error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching the member' });
  }
}

// GET /api/members/me
// Logged-in member views their own profile
async function getMyMemberProfile(req, res) {
  try {
    const member = await getMemberByUserId(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'No member profile found for your account yet' });
    }
    return res.json({ member });
  } catch (err) {
    console.error('Get my member profile error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching your profile' });
  }
}

// POST /api/members
// Librarian/Admin creates a member profile for an existing user account
async function addMember(req, res) {
  try {
    const { user_id, student_id, department, membership_type, expiry_date } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    // Make sure the user account exists
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'No user account found with that id' });
    }

    // Check a member profile doesn't already exist for this user
    const existing = await getMemberByUserId(user_id);
    if (existing) {
      return res.status(409).json({ message: 'This user already has a member profile' });
    }

    const memberId = await createMember({ user_id, student_id, department, membership_type, expiry_date });
    const member = await getMemberById(memberId);

    return res.status(201).json({ message: 'Member profile created successfully', member });
  } catch (err) {
    console.error('Add member error:', err);
    return res.status(500).json({ message: 'Something went wrong creating the member profile' });
  }
}

// PUT /api/members/:id
async function editMember(req, res) {
  try {
    const existing = await getMemberById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const updated = { ...existing, ...req.body };
    await updateMember(req.params.id, updated);

    const member = await getMemberById(req.params.id);
    return res.json({ message: 'Member profile updated successfully', member });
  } catch (err) {
    console.error('Edit member error:', err);
    return res.status(500).json({ message: 'Something went wrong updating the member' });
  }
}

// DELETE /api/members/:id
async function removeMember(req, res) {
  try {
    const existing = await getMemberById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await deleteMember(req.params.id);
    return res.json({ message: 'Member profile deleted successfully' });
  } catch (err) {
    console.error('Delete member error:', err);
    return res.status(500).json({ message: 'Something went wrong deleting the member' });
  }
}

module.exports = {
  listMembers, getMember, getMyMemberProfile,
  addMember, editMember, removeMember
};
