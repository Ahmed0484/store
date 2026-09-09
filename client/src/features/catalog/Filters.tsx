import { Box, Button, Paper } from "@mui/material";
import Search from "./Search";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'price', label: 'Price: Low to high' },
]

type Props = {
  filtersData: {
    brands: string[];
    types: string[];
  }
}

export default function Filters({filtersData:data}:Props) {
  const { orderBy, brands, types } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  function resetFilters() {
    dispatch(resetParams());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  return (
    <Box sx={{ flexDirection: 'column', display: 'flex', gap: 3 }} >
      <Paper>
        <Search />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          selectedValue={orderBy}
          options={sortOptions}
          onChange={e => dispatch(setOrderBy(e.target.value))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>
      <Button onClick={() => resetFilters()}>Reset filters</Button>
    </Box>
  )
}