import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { userService } from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
  userService.getAllUsers()
    .then(setUsers)
    .catch(err => console.error(err));
}, []);


  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-6">
          All Users
        </h1>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
