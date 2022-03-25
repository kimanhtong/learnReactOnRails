import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "./withRouter";

class NewRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      ingredients: "",
      instruction: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.stripHtmlEntities = this.stripHtmlEntities.bind(this);
    this.fetchRecipe = this.fetchRecipe.bind(this)
  }

  fetchRecipe() {
    const url = `/api/v1/show/${this.props.id}`;
    fetch(url)
    .then (res => res.json())
    .then (data =>  {
      this.setState(data);
    })
    .catch (err => {
      console.log(err);
      this.props.navigate("/recipes");
    })
  };

  stripHtmlEntities(str) {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    let url = "/api/v1/recipes/create"; // new recipe
    if (this.props.id) {  // edit recipe
      url = `/api/v1/update/${this.props.id}`;
    }
    const { name, ingredients, instruction } = this.state;
    if (name.length == 0 || ingredients.length == 0 || instruction.length == 0)
      return;

    const body = {
      name,
      ingredients,
      instruction: instruction.replace(/\n/g, "<br>")
    };
    const token = document.querySelector('meta[name="csrf-token"]').content;
    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.props.navigate(`/recipe/view/${response.id}`))
      .catch(error => console.log(error.message));
  }
  componentDidMount() {
    if (this.props.id) {
      this.fetchRecipe();
    }
  }
  render() {
    console.log('recipe id: ', this.props.id);
    console.log('recipe details: ', this.state);
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            {this.props.id &&
            <h1 className="font-weight-normal mb-5">
              Edit your recipe to update our awesome recipe collection.
            </h1>}
            {!this.props.id &&
            <h1 className="font-weight-normal mb-5">
              Add a new recipe to our awesome recipe collection.
            </h1>}
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="recipeName">Recipe name</label>
                <input
                  type="text"
                  name="name"
                  id="recipeName"
                  className="form-control"
                  required
                  onChange={this.onChange}
                  value={this.state.name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeIngredients">Ingredients</label>
                <input
                  type="text"
                  name="ingredients"
                  id="recipeIngredients"
                  className="form-control"
                  required
                  onChange={this.onChange}
                  value={this.state.ingredients}
                />
                <small id="ingredientsHelp" className="form-text text-muted">
                  Separate each ingredient with a comma.
                </small>
              </div>
              <label htmlFor="instruction">Preparation Instructions</label>
              <textarea
                className="form-control"
                id="instruction"
                name="instruction"
                rows="5"
                required
                onChange={this.onChange}
                value={this.state.instruction}
              />
              {!this.props.id &&
              <button type="submit" className="btn custom-button mt-3">
                Create Recipe
              </button>}
              {this.props.id &&
              <button type="submit" className="btn custom-button mt-3">
                Save Recipe
              </button>}
              <Link to="/recipes" className="btn btn-link mt-3">
                Back to recipes
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(NewRecipe);