import React, {useState, useEffect} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({ingredients: ""});
  const addHtmlEntities = (str) => {
    return String(str)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
  let ingredientList = "No ingredients available";
  const navigate = useNavigate();

  const fetchRecipe = () => {
    const url = `/api/v1/show/${id}`;
    fetch(url)
    .then (res => res.json())
    .then (data =>  {
      setRecipe(data);
    })
    .catch (err => {
      console.log(err);
      navigate("/recipes");
    })
  };

  const deleteRecipe = () => {
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => navigate("/recipes"))
      .catch(error => console.log(error.message));
  }

  useEffect(fetchRecipe,[]);

  if (recipe.ingredients.length > 0) {
    ingredientList = recipe.ingredients
      .split(",")
      .map((ingredient, index) => (
        <li key={index} className="list-group-item">
          {ingredient}
        </li>
      ));
  }
  // const recipeInstruction = addHtmlEntities(recipe.instruction);
  const recipeInstruction = recipe.instruction;

  return (
    <div className="">
      <div className="hero position-relative d-flex align-items-center justify-content-center">
        <img
          src={recipe.image}
          alt={`${recipe.name} image`}
          className="img-fluid position-absolute"
        />
        <div className="overlay bg-dark position-absolute" />
        <h1 className="display-4 position-relative text-white">
          {recipe.name}
        </h1>
      </div>
      <div className="container py-5">
        <div className="row">
          <div className="col-sm-12 col-lg-3">
            <ul className="list-group">
              <h5 className="mb-2">Ingredients</h5>
              {ingredientList}
            </ul>
          </div>
          <div className="col-sm-12 col-lg-7">
            <h5 className="mb-2">Preparation Instructions</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: `${recipeInstruction}`
              }}
            />
          </div>
          <div className="col-sm-12 col-lg-2">
            <button type="button" className="btn btn-secondary" size='lg' onClick={()=>navigate(`/recipe/edit/${id}`)} >
              Edit   Recipe
            </button>
            <button type="button" className="btn btn-danger" size='lg' onClick={deleteRecipe}>
              Delete Recipe
            </button>
          </div>
        </div>
        <Link to="/recipes" className="btn btn-link">
          Back to recipes
        </Link>
      </div>
    </div>
  );
}

export default Recipe;
