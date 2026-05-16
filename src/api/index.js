import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export const adminLogin = (data) => {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/user/userInfo',
    method: 'get'
  })//TODO:此处前端页面没有展示
}

export const logout = () => {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export const getAnnouncementList = () => {
  return request({
    url: '/user/announcement/list',
    method: 'get'
  })
}

export const getRoomList = () => {
  return request({
    url: '/user/room/list',
    method: 'get'
  })//TODO
}

export const getRoomSeats = (roomId, date) => {
  return request({
    url: `/user/room/${roomId}/seats`,
    method: 'get',
    params: { date }
  })
}

export const getSeatSlots = (seatId, date) => {
  return request({
    url: `/user/seat/${seatId}/slots`,
    method: 'get',
    params: { date }
  })
}

export const bookBySeat = (data) => {
  return request({
    url: '/user/reservation/bookBySeat',
    method: 'post',
    data
  })//TODO：后续可能会出问题
}

export const queryAvailableSeats = (data) => {
  return request({
    url: '/user/reservation/queryAvailableSeats',
    method: 'post',
    data
  })
}

export const getMyReservations = (params) => {
  return request({
    url: '/user/reservation/myReservations',
    method: 'get',
    params
  })
}

export const cancelReservation = (id) => {
  return request({
    url: `/user/reservation/${id}/cancel`,
    method: 'put'
  })
}

export const checkIn = (data) => {
  return request({
    url: '/user/checkin',
    method: 'post',
    data
  })
}

export const checkOut = (data) => {
  return request({
    url: '/user/checkout',
    method: 'post',
    data
  })
}

export const getMessageList = (params) => {
  return request({
    url: '/user/message/list',
    method: 'get',
    params
  })
}

export const markMessageRead = (id) => {
  return request({
    url: `/user/message/${id}/read`,
    method: 'put'
  })
}

export const getVipCards = () => {
  return request({
    url: '/user/vip/cards',
    method: 'get'
  })
}

export const getMyVip = () => {
  return request({
    url: '/user/vip/myVip',
    method: 'get'
  })
}

export const purchaseVip = (data) => {
  return request({
    url: '/user/vip/purchase',
    method: 'post',
    data
  })
}

export const getAdminRoomList = () => {
  return request({
    url: '/admin/room/list',
    method: 'get'
  })
}

export const addRoom = (data) => {
  return request({
    url: '/admin/room',
    method: 'post',
    data
  })
}

export const getAdminSeatList = (roomId) => {
  return request({
    url: `/admin/room/${roomId}/seat/list`,
    method: 'get'
  })
}

export const updateSeatStatus = (id, data) => {
  return request({
    url: `/admin/seat/${id}/status`,
    method: 'put',
    data
  })
}

export const getAdminUserList = (params) => {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

export const updateAdminUserStatus = (id, data) => {
  return request({
    url: `/admin/user/${id}/status`,
    method: 'put',
    data
  })
}

export const getAdminSystemConfig = () => {
  return request({
    url: '/admin/system/config',
    method: 'get'
  })
}

export const updateAdminSystemConfig = (data) => {
  return request({
    url: '/admin/system/config',
    method: 'put',
    data
  })
}

export const getAdminAnnouncementList = (params) => {
  return request({
    url: '/admin/announcement/list',
    method: 'get',
    params
  })
}

export const addAdminAnnouncement = (data) => {
  return request({
    url: '/admin/announcement',
    method: 'post',
    data
  })
}
