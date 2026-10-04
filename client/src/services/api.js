const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("furnest_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ---- Auth -------------------------------------------------------------
export async function login(identifier, password) {
  const data = await request("/auth/login", { method: "POST", body: { identifier, password }, auth: false });
  localStorage.setItem("furnest_token", data.token);
  return data;
}

export async function register({ username, email, password, phone }) {
  const data = await request("/auth/register", { method: "POST", body: { username, email, password, phone }, auth: false });
  localStorage.setItem("furnest_token", data.token);
  return data;
}

export async function requestPasswordReset({ userId, email }) {
  return request("/auth/forgot-password", { method: "POST", body: { userId, email }, auth: false });
}

export async function getCurrentUser() {
  return request("/auth/me");
}

export function logout() {
  localStorage.removeItem("furnest_token");
}

// ---- Pets ---------------------------------------------------------------
export async function getPetsByOwner() {
  return request("/pets/mine");
}

export async function createPetProfile(pet) {
  return request("/pets", { method: "POST", body: pet });
}

// ---- Posts, likes, comments -----------------------------------------------
export async function getPosts() {
  const posts = await request("/posts", { auth: true });
  // Normalize Mongo's _id-based shape to the field names the UI expects.
  return posts.map((p) => ({
    post_id: p._id,
    type: p.type,
    start_date: p.startDate,
    end_date: p.endDate,
    price_per_day: p.pricePerDay,
    pet: p.pet && {
      pet_id: p.pet._id,
      name: p.pet.name,
      species: p.pet.species,
      breed: p.pet.breed,
      age: p.pet.age,
      photo: p.pet.photo,
      health_notes: p.pet.healthNotes,
      owner: p.pet.owner
    },
    owner: p.pet?.owner,
    likeCount: p.likeCount,
    likedByMe: p.likedByMe,
    comments: (p.comments || []).map((c) => ({
      comment_id: c._id,
      content: c.content,
      user: c.user
    }))
  }));
}

export async function createPost({ petId, type, startDate, endDate, pricePerDay, city }) {
  return request("/posts", { method: "POST", body: { petId, type, startDate, endDate, pricePerDay, city } });
}

export async function toggleLike({ postId }) {
  return request(`/posts/${postId}/like`, { method: "POST" });
}

export async function addComment({ postId, content }) {
  return request(`/posts/${postId}/comments`, { method: "POST", body: { content } });
}

export async function getSuggestedPrice({ city, species }) {
  return request(`/posts/suggested-price?city=${encodeURIComponent(city || "")}&species=${encodeURIComponent(species || "")}`, { auth: false });
}

// ---- Applications ("accept the job") -------------------------------------
export async function applyToPost({ postId }) {
  return request(`/posts/${postId}/apply`, { method: "POST" });
}

export async function getApplicationsForPost(postId) {
  return request(`/posts/${postId}/applications`);
}

// ---- Notifications ----------------------------------------------------------
export async function getNotifications() {
  return request("/notifications");
}

export async function markNotificationRead(notificationId) {
  return request(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

// ---- Chats --------------------------------------------------------------------
export async function getOrCreateChat({ otherUserId, postId }) {
  return request("/chats", { method: "POST", body: { otherUserId, postId } });
}

export async function getConversations() {
  return request("/chats");
}

export async function getMessages(chatId) {
  return request(`/chats/${chatId}/messages`);
}

export async function sendMessage({ chatId, content }) {
  return request(`/chats/${chatId}/messages`, { method: "POST", body: { content } });
}

export async function getPopularCaretakers() {
  return request('/users/popular-caretakers', { auth: false })
}

// ---- History (client-side composition until dedicated endpoints exist) --------
export async function getHistory() {
  const [posts] = await Promise.all([getPosts()]);
  return { given: posts, caredFor: [] }; // caredFor needs a "my applications" endpoint — not built yet
}

// ---- Applications / caretaker selection -------------------------------

export async function acceptApplication({ postId, applicationId }) {
  return request(
    `/posts/${postId}/applications/${applicationId}/accept`,
    { method: 'POST' }
  )
}


// ---- Bookings ----------------------------------------------------------

export async function getMyBookings() {
  return request('/bookings')
}

export async function completeBooking(bookingId) {
  return request(`/bookings/${bookingId}/complete`, {
    method: 'PATCH'
  })
}

export async function cancelBooking(bookingId) {
  return request(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH'
  })
}