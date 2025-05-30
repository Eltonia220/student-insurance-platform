import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, LifeBuoy, Bell, User, FileCheck, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "University of Nairobi", // Default or could be added to sign-up form
    applications: [
      { id: 1, provider: "AIG", plan: "Student Shield", status: "Approved", date: "2025-03-15" },
      { id: 2, provider: "Jubilee", plan: "Internship Cover", status: "Pending", date: "2025-04-05" }
    ]
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to sign in if not authenticated
      navigate('/signin');
      return;
    }
    
    // Get user data from localStorage (saved during sign-up)
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        
        // Merge stored user data with default data
        setUserData(prevData => ({
          ...prevData,
          firstName: parsedUserData.firstName || prevData.firstName,
          lastName: parsedUserData.lastName || prevData.lastName,
          email: parsedUserData.email || prevData.email,
          id: parsedUserData.id || ''
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // In a real app, you'd fetch additional user data from an API here
    // For example: getApplications(userId)
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirect to sign in page
    navigate('/signin');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, {userData.firstName}!</h1>
          <p className="text-gray-600 mt-1">{userData.email}</p>
          {userData.school && <p className="text-gray-600">{userData.school}</p>}
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          <Button variant="outline" size="icon">
            <User size={20} />
          </Button>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Browse Plans
            </CardTitle>
            <CardDescription>
              Find the perfect insurance plan for your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/browse-plans">Explore Available Plans</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              My Applications
            </CardTitle>
            <CardDescription>
              View and manage your insurance applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              Support
            </CardTitle>
            <CardDescription>
              Get help with your insurance questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/support">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <h2 className="text-xl font-bold mb-4">Your Recent Applications</h2>
      {userData.applications.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="py-4 px-6 text-left">Provider</th>
                  <th className="py-4 px-6 text-left">Plan</th>
                  <th className="py-4 px-6 text-left">Date</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userData.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">{app.provider}</td>
                    <td className="py-4 px-6">{app.plan}</td>
                    <td className="py-4 px-6">{app.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status === 'Approved' && <FileCheck className="mr-1 h-3 w-3" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/application/${app.id}`}>View Details</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="mb-8 bg-gray-50 border border-dashed border-gray-200">
          <CardContent className="py-6 text-center">
            <p className="text-gray-500">You don't have any applications yet.</p>
            <Button asChild className="mt-4">
              <Link to="/browse-plans">Browse Insurance Plans</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle>Personal Accident Cover</CardTitle>
            <CardDescription>
              Most popular for IT and Engineering students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-primary">Ksh 3,500</div>
              <Button asChild>
                <Link to="/browse-plans">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle>Comprehensive Student Cover</CardTitle>
            <CardDescription>
              All-in-one coverage for medical students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-primary">Ksh 5,200</div>
              <Button asChild>
                <Link to="/browse-plans">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;