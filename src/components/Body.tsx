import { Routes, Route } from 'react-router-dom';
import FreeBondTestPage from '../pages/FreeBondTestPage';
import Home from '../pages/Home';
import { Box } from '@chakra-ui/react';

function Body() {
  return (
    <Box>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        ></Route>
        <Route
          path="/freebondtestpage"
          element={<FreeBondTestPage />}
        ></Route>
      </Routes>
    </Box>
  );
}

export default Body;
