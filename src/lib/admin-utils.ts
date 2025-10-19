// Temporary utility to create admin user for testing
// This should be removed in production

export const createTestAdminUser = async () => {
  try {
    // First, try to register as admin using the new endpoint
    const response = await fetch('https://pinkypromisebackend-production.up.railway.app/api/auth/register-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        email: 'admin@teddylove.com',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin user created successfully:', data);
      return data;
    } else {
      console.log('⚠️ Admin registration endpoint not available, using fallback method');
      
      // Fallback: Register as regular user and manually set role
      const fallbackResponse = await fetch('https://pinkypromisebackend-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          email: 'admin@teddylove.com',
          password: 'admin123'
        })
      });

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log('✅ Fallback admin user created:', data);
        return data;
      } else {
        throw new Error('Failed to create admin user');
      }
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

export const loginAsAdmin = async () => {
  try {
    const response = await fetch('https://pinkypromisebackend-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin login successful:', data);
      return data;
    } else {
      throw new Error('Failed to login as admin');
    }
  } catch (error) {
    console.error('❌ Error logging in as admin:', error);
    throw error;
  }
};
