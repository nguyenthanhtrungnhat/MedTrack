import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  roleID: number
}

export default function DoctorRoute() {

  const token = sessionStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {

    const decoded = jwtDecode<JwtPayload>(token)

    if (decoded.roleID !== 1) {
      return <Navigate to="/" replace />
    }

  } catch (err) {
    console.error("Invalid token:", err)
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

