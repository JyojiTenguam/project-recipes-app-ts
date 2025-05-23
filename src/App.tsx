import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Components/Login';
import Meals from './Components/Meals';
import Drinks from './Components/Drinks';
import Profile from './Components/Profile';
import DoneRecipes from './Components/DoneRecipes';
import FavoriteRecipes from './Components/FavoriteRecipes';
import RecipeInProgress from './Components/RecipeInProgress';
import RecipeDetails from './Components/RecipeDetails';

function App() {
  return (
    <Routes>
      <Route index element={ <Login /> } />
      <Route path="/" element={ <Layout /> }>
        <Route path="/meals" element={ <Meals /> } />
        <Route path="/drinks" element={ <Drinks /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/done-recipes" element={ <DoneRecipes /> } />
        <Route path="/favorite-recipes" element={ <FavoriteRecipes /> } />
      </Route>
      <Route path="/drinks/:id" element={ <RecipeDetails /> } />
      <Route path="/meals/:id" element={ <RecipeDetails /> } />
      <Route path="/meals/:id/in-progress" element={ <RecipeInProgress /> } />
      <Route path="/drinks/:id/in-progress" element={ <RecipeInProgress /> } />
    </Routes>
  );
}

export default App;
