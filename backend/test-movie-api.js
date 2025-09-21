const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testMovieAPI() {
  try {
    console.log('🎬 Testing Movie API...\n');

    // Test 1: Get movie list
    console.log('1. Getting movie list...');
    const movieListResponse = await axios.get(`${BASE_URL}/folders/movies`);
    console.log('✅ Movie list retrieved:', {
      total: movieListResponse.data.total,
      page: movieListResponse.data.page,
      movies: movieListResponse.data.movies.length
    });

    // Test 2: Get movie list with pagination
    console.log('\n2. Getting movie list with pagination...');
    const paginatedResponse = await axios.get(`${BASE_URL}/folders/movies?page=1&limit=5`);
    console.log('✅ Paginated movie list:', {
      total: paginatedResponse.data.total,
      page: paginatedResponse.data.page,
      limit: 5,
      movies: paginatedResponse.data.movies.length
    });

    // Test 3: Get movie list for specific user
    console.log('\n3. Getting movie list for specific user...');
    const userMoviesResponse = await axios.get(`${BASE_URL}/folders/movies?userId=test-user-123`);
    console.log('✅ User movies:', {
      total: userMoviesResponse.data.total,
      movies: userMoviesResponse.data.movies.length
    });

    // Test 4: Create a test movie
    console.log('\n4. Creating a test movie...');
    const testMovie = {
      name: 'Test Movie',
      title: 'Test Movie Title',
      description: 'A test movie for API testing',
      publishingYear: 2024,
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      userId: 'test-user-123',
      status: 'pending',
      tags: ['test', 'api'],
      estimatedCost: 0,
      actualCost: 0
    };

    const createResponse = await axios.post(`${BASE_URL}/folders`, testMovie);
    console.log('✅ Test movie created:', createResponse.data._id);

    // Test 5: Get updated movie list
    console.log('\n5. Getting updated movie list...');
    const updatedListResponse = await axios.get(`${BASE_URL}/folders/movies`);
    console.log('✅ Updated movie list:', {
      total: updatedListResponse.data.total,
      movies: updatedListResponse.data.movies.length
    });

    console.log('\n🎉 All movie API tests passed successfully!');
    console.log('\n📚 API Documentation available at: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testMovieAPI();
