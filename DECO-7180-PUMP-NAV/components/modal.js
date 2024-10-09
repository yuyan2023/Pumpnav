$(document).ready(function () {
    const $modal = $('.modal');

    if($modal.length === 0){
        return
    }

    const $closeBtn = $('.modal .close');
    $closeBtn.click(function () {
        $modal.hide();
    });


    $(window).click(function (event) {
        if ($(event.target).hasClass('modal')) {
            $modal.hide();
        }
    });
});