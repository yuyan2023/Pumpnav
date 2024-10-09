import './components/modal.js';
import { fetchAllBrand, fetchAllType, fetchPriceRange } from './components/api.js';

const setupModal = () => {
    const $modal = $('#filter-popup');
    const $btn = $('#open-filter-btn');

    $btn.click(function () {
        $modal.show();
    });
}

const generateFilters = async () => {
    const priceRange = await fetchPriceRange();
    const allBrand = await fetchAllBrand();
    const allTypes = await fetchAllType();

    setupPriceRangeInput(priceRange);
    setupDistanceRangeInput();
    generateBrands(allBrand);
    generateTypes(allTypes);
}

const setupPriceRangeInput = priceRange => {
    const { max, min } = priceRange[0]
    $('input[name="min-price"]').val(min);
    const $input = $('#price-range');
    $input.next().text(`AUD $${min} - AUD $${max}`);
    $input.attr({ min, max, value: max }).bind('input', () => {
        const value = $input.val();
        $input.next().text(`AUD $${min} - AUD $${value}`);
    })
}
const setupDistanceRangeInput = () => {
    const $input = $('#distance-range');
    $input.bind('input', () => {
        const value = $input.val();
        $input.next().text(`0km - ${value}km`);
    })
}

const generateBrands = data => {
    const $all = $("#brand-all");
    $all.click(() => {
        if ($all.is(':checked')) {
            $('input[name="brand"]').prop('checked', true);
        } else {
            $('input[name="brand"]').prop('checked', false);
        }
    })

    const clickHandler = () => {
        if ($('input[name="brand"]:checked').length == 8) {
            $all.prop('checked', true);
        } else {
            $all.prop('checked', false);
        }
    }

    const $container = $("#form-petrol-brand");
    data.splice(0, 8).forEach(type => {
        const $span = $(`<span><input type="checkbox" name="brand" checked value="${type.Site_Brand}"></span>`);
        $span.click(clickHandler);
        $span.append(`<label for="${type.Site_Brand}" class="filter-button">${type.Site_Brand}</label>`);
        $container.append($span);
    });
}

const generateTypes = data => {
    const $all = $("#type-all");
    $all.click(() => {
        if ($all.is(':checked')) {
            $('input[name="type"]').prop('checked', true);
        } else {
            $('input[name="type"]').prop('checked', false);
        }
    })

    const clickHandler = () => {
        if ($('input[name="type"]:checked').length == data.length) {
            $all.prop('checked', true);
        } else {
            $all.prop('checked', false);
        }
    }

    const $container = $("#form-petrol-type");
    data.forEach(type => {
        const $span = $(`<span><input type="checkbox" name="type" checked value="${type.Fuel_Type}"></span>`);
        $span.click(clickHandler);
        $span.append(`<label for="${type.Fuel_Type}" class="filter-button">${type.Fuel_Type}</label>`);
        $container.append($span);
    });
}

const bindSearch = () => {
    $("#search-btn, #modal-search-btn").click(() => {
        const q = $('#search-input').val();
        if (!q) { return }

        const minPrice = $('input[name="min-price"]').val();
        const maxPrice = $('#price-range').val();
        const brand = $('input[name="brand"]:checked').map((index, item) => item.value).get();
        const type = $('input[name="type"]:checked').map((index, item) => item.value).get();
        const maxDistance = $('#distance-range').val();

        const params = new URLSearchParams({
            q,
            brand,
            type,
            price: `${minPrice}-${maxPrice}`,
            distance: `0-${maxDistance}`
        });

        const targetUrl = './pages/result/result.html?' + params.toString();
        window.location.href = targetUrl;
    })
}

$(document).ready(() => {
    setupModal();
    generateFilters();
    bindSearch();
});