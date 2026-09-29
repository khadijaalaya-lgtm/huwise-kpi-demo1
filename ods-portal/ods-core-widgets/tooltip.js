(function () {
    'use strict';
    var mod = angular.module('ods-widgets');

    mod.directive('odsTooltip', ['$compile', '$window', 'gettextCatalog', '$interpolate', function ($compile, $window, gettextCatalog, $interpolate) {
        // ods-tooltip [text]
        // [ods-tooltip-template expression]
        // [ods-tooltip-disabled boolean]
        // [ods-tooltip-direction left,right,top,bottom]
        // [ods-tooltip-delay time]

        // FIXME: Two classes because ods-tooltip is the V4 style and odsTooltip is the legacy style
        var tooltip = $('<div class="ods-tooltip"></div>').hide();
        $(document.body).append(tooltip);
        return {
            require: 'odsTooltip',
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                // we need to fetch the raw text before it is translated
                var ctrl = this;
                $scope.$watch(function () {
                    return [$attrs.odsTooltip, $attrs.translatePlural]
                }, function (nv) {
                    ctrl.rawTextTooltip = $attrs.odsTooltip;
                    ctrl.rawTextTooltipPlural = $attrs.translatePlural;
                }, true);
            },
            link: function (scope, element, attrs, ctrl) {
                var timeout, tooltipText;

                function showTooltip(content, position, e) {
                    if (content === '') {
                        return;
                    }
                    // add tooltip content
                    tooltip[0].innerHTML = '';
                    tooltip.append(content);
                    scope.$apply();

                    // position tooltip
                    if (['left', 'right', 'top', 'bottom'].indexOf(position) < 0) {
                        if (e.clientX < $($window).width() / 2) {
                            position = 'right';
                        } else {
                            position = 'left';
                        }
                    }
                    angular.forEach(['left', 'right', 'top', 'bottom'], function (direction) {
                        tooltip.removeClass('ods-tooltip--' + direction);
                    });
                    switch (position) {
                        case 'left':
                            tooltip.addClass('ods-tooltip--left');
                            tooltip.css({
                                left: '',
                                right: $($window).width() - element.offset().left,
                                top: element.offset().top,
                                bottom: ''
                            });
                            break;
                        case 'right':
                            tooltip.addClass('ods-tooltip--right');
                            tooltip.css({
                                left: element.offset().left + element.outerWidth(),
                                right: '',
                                top: element.offset().top,
                                bottom: ''
                            });
                            break;
                        case 'top':
                            tooltip.addClass('ods-tooltip--top');
                            tooltip.css({
                                left: element.offset().left + element.outerWidth() / 2,
                                right: '',
                                top: '',
                                bottom: $($window).height() - element.offset().top
                            });
                            break;
                        case 'bottom':
                            tooltip.addClass('ods-tooltip--bottom');
                            tooltip.css({
                                left: element.offset().left + element.outerWidth() / 2,
                                right: '',
                                top: element.offset().top + element.outerHeight(),
                                bottom: ''
                            });
                            break;
                    }
                    tooltip.show();
                    scope.$watch(attrs.odsTooltipDisabled, function (newValue, oldValue) {
                        if (!!newValue) {
                            tooltip.hide();
                        }
                    });
                }

                var buildAndShowTooltip = function (e) {
                    if (attrs.translate && attrs.translate === "ods-tooltip") {
                        if (angular.isDefined(attrs.translateN)) {
                            tooltipText = gettextCatalog.getPlural(scope.$eval(attrs.translateN), ctrl.rawTextTooltip, ctrl.rawTextTooltipPlural, scope, attrs.translateContext || null);
                        } else {
                            tooltipText = gettextCatalog.getString(ctrl.rawTextTooltip, scope, attrs.translateContext || null);
                        }
                    } else {
                        tooltipText = $interpolate(ctrl.rawTextTooltip)(scope);
                    }

                    if(!tooltipText) {
                        return;
                    }

                    if (!scope.$eval(attrs.odsTooltipDisabled)) {
                        var delay = attrs.hasOwnProperty('odsTooltipDelay') ? attrs.odsTooltipDelay : 200;
                        // delay
                        if (angular.isDefined(delay) && delay !== '') {
                            // FIXME: This is a workaround to block a case where mouseenter is triggered twice
                            timeout = setTimeout(function () {
                                if (attrs.hasOwnProperty('odsTooltipTemplate') && scope.$eval(attrs.odsTooltipTemplate)) {
                                    showTooltip(scope.$eval(attrs.odsTooltipTemplate), attrs.odsTooltipDirection, e);
                                } else {
                                    showTooltip(tooltipText, attrs.odsTooltipDirection, e);
                                }
                            }, attrs.hasOwnProperty('odsTooltipDelay') ? attrs.odsTooltipDelay : 200);
                        }
                    }
                };

                element.on('mouseenter', buildAndShowTooltip);
                scope.$on('refresh-tooltip', buildAndShowTooltip);

                element.on('mouseleave', function (e) {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    tooltip.hide();
                    tooltip[0].innerHTML = '';
                });
                element.on('focusout', function () {
                    tooltip.hide();
                });
                element.on('$destroy', function () {
                    tooltip.hide();
                });
            }
        };
    }]);

    mod.directive('odsDisabledTooltip', ['$compile', 'gettextCatalog' ,function ($compile, gettextCatalog) {
        return {
            controller: function($scope, $element, $attrs) {
                $scope.rawTextDisabledTooltip = $attrs.odsDisabledTooltipText;
                $scope.rawTextTooltipPlural = $attrs.translatePlural;
            },
            link: function (scope, element, attrs) {
                // add a wrapper with the same display mode as the original element to try not to break positioning
                var classes = '';
                if (attrs.odsDisabledTooltipWrapperClass) {
                    classes = ' ' + attrs.odsDisabledTooltipWrapperClass;
                }
                element.wrap('<span class="ods-disabled-tooltip'+classes+'" style="display: ' + element.css('display') + ';"></span>');

                var tooltipScope = scope.$new(false);
                if (angular.isUndefined(attrs.odsDisabledTooltipDelay)) {
                    tooltipScope.delay = 200;
                } else {
                    tooltipScope.delay = parseInt(attrs.odsDisabledTooltipDelay, 10);
                }

                if (attrs.translate && attrs.translate === "ods-disabled-tooltip-text") {
                    if (angular.isDefined(attrs.translateN)) {
                        tooltipScope.text = gettextCatalog.getPlural(scope.$eval(attrs.translateN), scope.rawTextDisabledTooltip, scope.rawTextTooltipPlural, scope, attrs.translateContext || null);
                    } else {
                        tooltipScope.text = gettextCatalog.getString(scope.rawTextDisabledTooltip, scope, attrs.translateContext || null);
                    }
                } else {
                    tooltipScope.text = scope.rawTextDisabledTooltip;
                }

                tooltipScope.template = scope.$eval(attrs.odsDisabledTooltipTemplate);
                tooltipScope.direction = attrs.odsDisabledTooltipDirection;
                scope.$watch(attrs.odsDisabledTooltip, function (nv, ov) {
                    tooltipScope.disabledTooltip = nv;
                    element.prop("disabled", nv);
                });
                if (scope.rawTextTooltipPlural) {
                    element.parent().append($compile('<div ng-show="disabledTooltip" class="ods-disabled-tooltip__overlay" ods-tooltip="{{text}}" translate="ods-tooltip" translate-plural="' + scope.rawTextTooltipPlural + '" translate-n="' + attrs.translateN + '" ods-tooltip-template="template" ods-tooltip-direction="direction" ods-tooltip-delay="{{delay}}"></div>')(tooltipScope));
                } else {
                    element.parent().append($compile('<div ng-show="disabledTooltip" class="ods-disabled-tooltip__overlay" ods-tooltip="{{text}}" translate="ods-tooltip" ods-tooltip-template="template" ods-tooltip-direction="{{ direction }}" ods-tooltip-delay="{{delay}}"></div>')(tooltipScope));
                }
            }
        };
    }]);
}());
