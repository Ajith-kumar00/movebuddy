const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🚀 Testing MoveBuddy API with new fields...\n');

    // Test 1: Create a new folder with all new fields
    console.log('1. Creating a new folder with title, publishingYear, and image...');
    const newFolder = {
      name: 'Moving to New York',
      title: 'New York Relocation Project 2024',
      description: 'Moving from California to New York for work',
      publishingYear: 2024,
      image: 'https://example.com/nyc-move.jpg',
      userId: 'test-user-123',
      status: 'pending',
      tags: ['work', 'urgent', 'relocation'],
      estimatedCost: 5000,
      actualCost: 0
    };

    const createResponse = await axios.post(`${BASE_URL}/folders`, newFolder);
    console.log('✅ Folder created successfully:', createResponse.data._id);
    const folderId = createResponse.data._id;

    // Test 2: Get the created folder
    console.log('\n2. Retrieving the created folder...');
    const getResponse = await axios.get(`${BASE_URL}/folders/${folderId}`);
    console.log('✅ Folder retrieved:', {
      name: getResponse.data.name,
      title: getResponse.data.title,
      publishingYear: getResponse.data.publishingYear,
      image: getResponse.data.image
    });

    // Test 3: Search by title
    console.log('\n3. Searching folders by title...');
    const searchResponse = await axios.get(`${BASE_URL}/folders/search?q=New York`);
    console.log('✅ Search results:', searchResponse.data.length, 'folders found');

    // Test 4: Search by publishing year
    console.log('\n4. Searching folders by publishing year...');
    const yearResponse = await axios.get(`${BASE_URL}/folders/year/2024`);
    console.log('✅ Year search results:', yearResponse.data.length, 'folders found');

    // Test 5: Update the folder
    console.log('\n5. Updating folder with new image...');
    const updateResponse = await axios.patch(`${BASE_URL}/folders/${folderId}`, {
      image: 'https://example.com/updated-nyc-move.jpg',
      actualCost: 4500
    });
    console.log('✅ Folder updated:', {
      image: updateResponse.data.image,
      actualCost: updateResponse.data.actualCost
    });

    // Test 6: Get all folders
    console.log('\n6. Getting all folders...');
    const allFoldersResponse = await axios.get(`${BASE_URL}/folders`);
    console.log('✅ Total folders:', allFoldersResponse.data.total);

    // Test 7: Get statistics
    console.log('\n7. Getting folder statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/folders/stats`);
    console.log('✅ Statistics:', statsResponse.data);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📚 API Documentation available at: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAPI();
