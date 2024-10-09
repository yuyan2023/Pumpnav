const FUEL_DATA_API_SQL = "https://www.data.qld.gov.au/api/3/action/datastore_search_sql"

const SQL = {
    allBrand: 'SELECT DISTINCT "Site_Brand" FROM "28ab00ec-00dd-4edf-b272-0543df4dcbe5"',
    allType: 'SELECT DISTINCT "Fuel_Type" FROM "28ab00ec-00dd-4edf-b272-0543df4dcbe5"',
    priceRange: 'SELECT MAX("Price") AS max, MIN("Price") AS min FROM "28ab00ec-00dd-4edf-b272-0543df4dcbe5" WHERE "Price" < 5000'
};

const fetchData = async data => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: FUEL_DATA_API_SQL,
            data,
            type: "get",
            success: (data) => {
                resolve(data.result.records)
            },
            error: (jqXHR, textStatus, errorThrown) => reject(errorThrown)
        });
    });
}

const fetchAllBrand = async () => {
    return await fetchData({ sql: SQL.allBrand })
}

const fetchAllType = async () => {
    return await fetchData({ sql: SQL.allType })
}

const fetchPriceRange = async () => {
    return await fetchData({ sql: SQL.priceRange })
}

export { fetchAllBrand, fetchAllType, fetchPriceRange };