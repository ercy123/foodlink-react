import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);

  function handleIngredientSelection(ingredient) {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const availableIngredients = ['chicken', 'beef', 'pork', 'tofu', 'tako', 'sungchan'];

  const filteredIngredients = availableIngredients.filter((ingredient) =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIngredientClick = (ingredient) => {
    handleIngredientSelection(ingredient);
    setSearchTerm('');
  };

  const handleSearchRecipe = () => {
    // Send GET request to the Spring Boot server with selected ingredients as query parameters
    const selectedIngredientsQuery = selectedIngredients.join(',');
    const url = `http://192.168.219.131:8080/foodlink/getMenu?ingredients=${selectedIngredientsQuery}`; // Replace with your server URL
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRecipeSuggestions(data);
        setShowResults(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    if (showResults && selectedIngredients.length === 0) {
      // Reset the results when no ingredients are selected
      setRecipeSuggestions([]);
      setShowResults(false);
    }
  }, [showResults, selectedIngredients.length]);

  return (
    <div className="App">
      <div className="left-column">
        <h2>Choose Your Ingredients:</h2>
        <div className="ingredient-search">
          <input
            type="text"
            placeholder="Search for an ingredient"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <ul className="ingredient-suggestions">
              {filteredIngredients.map((ingredient) => (
                <li key={ingredient} onClick={() => handleIngredientClick(ingredient)}>
                  {ingredient}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ingredient-list">
          {availableIngredients.map((ingredient) => (
            <button
              key={ingredient}
              className={selectedIngredients.includes(ingredient) ? 'selected' : ''}
              onClick={() => handleIngredientSelection(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
        <button className="search-button" onClick={handleSearchRecipe}>
          Search Recipe
        </button>
      </div>
      <div className="right-column">
        {showResults && (
          <>
            <h2>Recipe Suggestions:</h2>
            {selectedIngredients.length === 0 && <p>Please select some ingredients to see recipe suggestions.</p>}
            {selectedIngredients.length > 0 && (
              <div>
                {recipeSuggestions.length === 0 ? (
                  <p>No recipe suggestions found for the selected ingredients.</p>
                ) : (
                  <ul>
                  {recipeSuggestions.map((recipe, index) => (
                    <li key={index}>
                      <h3>{recipe.name}</h3>
                      <p>Ingredients: {recipe.ingredients}</p>
                      <p>Instructions: {recipe.instructions}</p>
                    </li>
                  ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
  }
  
  export default App;