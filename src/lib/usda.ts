// USDA FoodData Central API client

export interface USDAFood {
  fdcId: number;
  name: string;
  brand?: string;
  grams: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface USDASearchResponse {
  foods: USDAFoodJSON[];
}

interface USDAFoodJSON {
  fdcId: number;
  description: string;
  brandOwner?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: USDANutrient[];
}

interface USDANutrient {
  nutrientId: number;
  value: number;
}

// Nutrient IDs in USDA FDC
const CALORIE_ID = 1008;
const PROTEIN_ID = 1003;
const CARBS_ID = 1005;
const FAT_ID = 1004;

export async function searchUSDA(query: string, apiKey?: string): Promise<USDAFood[]> {
  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', '10');
  if (apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`USDA search failed: ${response.status}`);
  }

  const data: USDASearchResponse = await response.json();
  return data.foods.map(toUSDAFood);
}

function toUSDAFood(f: USDAFoodJSON): USDAFood {
  const grams = f.servingSize && f.servingSize > 0 && f.servingSizeUnit === 'g'
    ? f.servingSize
    : 100;

  const nutrients = f.foodNutrients.reduce((acc, n) => {
    acc[n.nutrientId] = (n.value * grams) / 100;
    return acc;
  }, {} as Record<number, number>);

  return {
    fdcId: f.fdcId,
    name: f.description,
    brand: f.brandOwner,
    grams,
    servingLabel: grams > 0 ? `per ${Math.round(grams)}g` : 'per 100g',
    calories: nutrients[CALORIE_ID] || 0,
    protein: nutrients[PROTEIN_ID] || 0,
    carbs: nutrients[CARBS_ID] || 0,
    fat: nutrients[FAT_ID] || 0,
  };
}
