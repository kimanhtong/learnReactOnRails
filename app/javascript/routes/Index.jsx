import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Recipes from "../components/Recipes";
import Recipe from "../components/Recipe";
import NewRecipe from "../components/NewRecipe";

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/recipe/view/:id" element={<Recipe/>} />
      <Route path="/recipes" element={<Recipes/>} />
      <Route path="/recipe" element={<NewRecipe/>} />
      <Route path="/recipe/edit/:id" element={<NewRecipe/>} />
    </Routes>
  </Router>
);