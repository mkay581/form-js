"use strict";
var Sinon = require('sinon');
var QUnit = require('qunit');
var TestUtils = require('test-utils');
var ButtonToggle = require('../src/button-toggle');

module.exports = (function () {

    QUnit.module('Button Toggle');

    var checkboxHtml = '' +
        '<div class="container">' +
        '<label><input type="checkbox" class="ui-button-toggle-input" value="NY" name="state1" />New York</label>' +
        '<label><input type="checkbox" class="ui-button-toggle-input" value="MD" name="state2" />Maryland</label>' +
        '<label><input type="checkbox" class="ui-button-toggle-input" value="DC" name="state3" />District Of Columbia</label>' +
        '</div>';

    var radioHtml = '' +
        '<div class="container">' +
        '<label><input type="radio" class="ui-button-toggle-input" value="AAPL" name="stocks" />Apple</label>' +
        '<label><input type="radio" class="ui-button-toggle-input" value="FB" name="stocks" />Facebook</label>' +
        '<label><input type="radio" class="ui-button-toggle-input" value="VZ" name="stocks" />Verizon</label>' +
        '</div>';

    var selectedClass = 'ui-button-toggle-selected',
        disabledClass = 'ui-button-toggle-disabled',
        inputClass = 'ui-button-toggle-input',
        wrapperClass = 'ui-button-toggle';

    QUnit.test('initializing/destroying', function() {
        QUnit.expect(6);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var containers = wrapper.getElementsByTagName('label');
        var instance = new ButtonToggle({inputs: inputs});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        QUnit.ok(UIElements[0].childNodes[0].isEqualNode(inputs[0]), 'after init, ui button toggle wrapper html was created for first el');
        QUnit.ok(UIElements[1].childNodes[0].isEqualNode(inputs[1]), 'ui button toggle wrapper html was created for second el');
        QUnit.ok(UIElements[2].childNodes[0].isEqualNode(inputs[2]), 'ui button toggle wrapper html was created for third el');
        instance.destroy();
        QUnit.equal(inputs[0].parentNode, containers[0], 'after destroy, first input element\'s parent node is back to original');
        QUnit.equal(inputs[1].parentNode, containers[1], 'second input element\'s parent node is back to original');
        QUnit.equal(inputs[2].parentNode, containers[2], 'third input element\'s parent node is back to original');
    });

    QUnit.test('initializing using a container (deprecated)', function() {
        QUnit.expect(6);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var containers = wrapper.getElementsByTagName('label');
        var instance = new ButtonToggle({container: wrapper});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        QUnit.ok(UIElements[0].childNodes[0].isEqualNode(inputs[0]), 'after init, ui button toggle wrapper html was created for first el');
        QUnit.ok(UIElements[1].childNodes[0].isEqualNode(inputs[1]), 'ui button toggle wrapper html was created for second el');
        QUnit.ok(UIElements[2].childNodes[0].isEqualNode(inputs[2]), 'ui button toggle wrapper html was created for third el');
        instance.destroy();
        QUnit.equal(inputs[0].parentNode, containers[0], 'after destroy, first input element\'s parent node is back to original');
        QUnit.equal(inputs[1].parentNode, containers[1], 'second input element\'s parent node is back to original');
        QUnit.equal(inputs[2].parentNode, containers[2], 'third input element\'s parent node is back to original');
    });

    QUnit.test('checkbox: selecting and deselecting checkbox toggles', function() {
        QUnit.expect(14);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        var onChangeCallCount = 0;
        // select first toggle
        instance.select(0);
        onChangeCallCount++;
        QUnit.deepEqual(onChangeSpy.args[onChangeCallCount - 1], [inputs[0].value, inputs[0], UIElements[0]], 'when first toggle item is clicked, onChange callback fired with correct args');
        QUnit.ok(inputs[0].checked, 'first toggle input boolean returns truthy');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first toggle ui element contains active class');
        // deselect first toggle again
        instance.deselect(0);
        onChangeCallCount++;
        QUnit.deepEqual(onChangeSpy.args[onChangeCallCount - 1], [inputs[0].value, inputs[0], UIElements[0]], 'when first toggle item is clicked again, onChange callback fired with correct args');
        QUnit.ok(!inputs[0].checked, 'first toggle input boolean returns falsy');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first toggle ui element does NOT contain active class');
        // select second toggle
        instance.select(1);
        onChangeCallCount++;
        QUnit.deepEqual(onChangeSpy.args[onChangeCallCount - 1], [inputs[1].value, inputs[1], UIElements[1]], ' when second toggle item is clicked, onChange callback fired with correct args');
        QUnit.ok(inputs[1].checked, 'second toggle input boolean returns truthy');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second toggle ui element contains active class');
        // select third toggle
        instance.select(2);
        onChangeCallCount++;
        QUnit.deepEqual(onChangeSpy.args[onChangeCallCount - 1], [inputs[2].value, inputs[2], UIElements[2]], 'when third toggle item is clicked, onChange callback fired with correct args');
        QUnit.ok(inputs[2].checked, 'third toggle input boolean returns truthy');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third toggle ui element contains active class');
        QUnit.ok(inputs[1].checked, 'second toggle input boolean still returns true');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second toggle ui element still contains active class');
        instance.destroy();
    });

    QUnit.test('checkbox: clicking input field', function() {
        QUnit.expect(12);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // click first input
        inputs[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first input input fires onChange callback with correct args');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first input ui element contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second input ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third input ui element does NOT contain active class');
        // click first input again
        inputs[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first input input again fires onChange callback again with correct args');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first input ui element no longer contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second input ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third input ui element does NOT contain active class');
        // click second input
        inputs[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[1].value, inputs[1], UIElements[1]], 'clicking on second input input fires onChange callback with correct args');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second input ui element now contains active class');
        // click third input
        inputs[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[3], [inputs[2].value, inputs[2], UIElements[2]], 'clicking on third input input fires onChange callback with correct args');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third input ui element now contains active class');
        instance.destroy();
    });

    QUnit.test('checkboxes: clicking label', function() {
        QUnit.expect(12);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var labels = wrapper.getElementsByTagName('label');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // click first label
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first label fires onChange callback with correct args');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first label ui element contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click first label again
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first label again fires onChange callback again with correct args');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first label ui element no longer contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click second label
        labels[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[1].value, inputs[1], UIElements[1]], 'clicking on second label fires onChange callback with correct args');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second label ui element now contains active class');
        // click third label
        labels[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[3], [inputs[2].value, inputs[2], UIElements[2]], 'clicking on third label fires onChange callback with correct args');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third label ui element now contains active class');
        instance.destroy();
    });

    QUnit.test('radio buttons: selecting and deselecting', function() {
        QUnit.expect(28);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // select first toggle
        instance.select(0);
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'onChange callback fired with correct args when select() was called on first toggle');
        QUnit.ok(inputs[0].checked, 'first toggle input boolean returns truthy');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first toggle ui element contains active class');
        QUnit.ok(!inputs[1].checked, 'second toggle input boolean returns falsy');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second toggle ui element does NOT contain active class');
        QUnit.ok(!inputs[2].checked, 'third toggle input boolean returns falsy');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third toggle ui element does NOT contain active class');
        // select first toggle again
        instance.select(0);
        QUnit.equal(onChangeSpy.callCount, 1, 'clicking on first toggle again, does NOT fire onChange callback');
        QUnit.ok(inputs[0].checked, 'first toggle input boolean still returns truthy');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first toggle ui element still contains active class');
        QUnit.ok(!inputs[1].checked, 'second toggle input boolean returns falsy');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second toggle ui element does NOT contain active class');
        QUnit.ok(!inputs[2].checked, 'third toggle input boolean returns falsy');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third toggle ui element does NOT contain active class');
        // select second toggle
        instance.select(1);
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], UIElements[1]], 'onChange callback fired with correct args when select() was called on second toggle');
        QUnit.ok(inputs[1].checked, 'second toggle input boolean returns truthy');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second toggle ui element contains active class');
        QUnit.ok(!inputs[0].checked, 'first toggle input boolean returns falsy');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first toggle ui element does NOT contain active class');
        QUnit.ok(!inputs[2].checked, 'third toggle input boolean returns falsy');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third toggle ui element does NOT contain active class');
        // select third toggle
        instance.select(2);
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], UIElements[2]], 'onChange callback fired with correct args when select() was called on third toggle');
        QUnit.ok(inputs[2].checked, 'third toggle input boolean returns truthy');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third toggle ui element contains active class');
        QUnit.ok(!inputs[0].checked, 'first toggle input boolean returns falsy');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first toggle ui element does NOT contain active class');
        QUnit.ok(!inputs[1].checked, 'second toggle input boolean returns falsy');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second toggle ui element does NOT contain active class');
        instance.destroy();
    });

    QUnit.test('radio buttons: clicking on input elements', function() {
        QUnit.expect(16);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // click first toggle
        inputs[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first input input, fires onChange callback with correct args');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first input input contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second input input does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third input input does NOT contain active class');
        // click first input again
        inputs[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.equal(onChangeSpy.callCount, 1, 'clicking on first input input again, does NOT fire onChange callback');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first input ui element still contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second input ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third input ui element does NOT contain active class');
        // click second input
        inputs[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], UIElements[1]], 'clicking on second input input, fires onChange callback with correct args');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second input ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first input ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third input ui element does NOT contain active class');
        // click third input
        inputs[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], UIElements[2]], 'clicking on third input input, fires onChange callback with correct args');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third input ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first input ui element does NOT contain active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second input ui element does NOT contain active class');
        instance.destroy();
    });

    QUnit.test('radio buttons: clicking labels', function() {
        QUnit.expect(16);
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var labels = wrapper.getElementsByTagName('label');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // click first label
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first label, fires onChange callback with correct args');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first label ui element contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click first label again
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.equal(onChangeSpy.callCount, 1, 'clicking on first label again, does NOT fire onChange callback');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first label ui element still contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click second label
        labels[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], UIElements[1]], 'clicking on second label, fires onChange callback with correct args');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second label ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click third label
        UIElements[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], UIElements[2]], 'clicking on third label, fires onChange callback with correct args');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third label ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first label ui element does NOT contain active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        instance.destroy();
    });

    QUnit.test('radio buttons: clicking labels when they are not the input field\'s parent', function() {
        QUnit.expect(16);
        var radioHtml = '' +
            '<div class="container">' +
                '<label for="test-stock-apple">Apple</label>' +
                '<input type="radio" id="test-stock-apple" class="ui-button-toggle-input" value="AAPL" name="stocks" />' +
                '<label for="test-stock-fb">Facebook</label>' +
                '<input type="radio"  id="test-stock-fb" class="ui-button-toggle-input" value="FB" name="stocks" />' +
                '<label for="test-stock-vz">Verizon</label>' +
                '<input type="radio"  id="test-stock-vz" class="ui-button-toggle-input" value="VZ" name="stocks" />' +
            '</div>';
        var fixture = document.getElementById('qunit-fixture');
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        fixture.appendChild(wrapper);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var labels = wrapper.getElementsByTagName('label');
        var onChangeSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs, onChange: onChangeSpy});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        // click first label
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[0], [inputs[0].value, inputs[0], UIElements[0]], 'clicking on first label, fires onChange callback with correct args');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first label ui element contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click first label again
        labels[0].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.equal(onChangeSpy.callCount, 1, 'clicking on first label again, does NOT fire onChange callback');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first label ui element still contains active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click second label
        labels[1].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[1], [inputs[1].value, inputs[1], UIElements[1]], 'clicking on second label, fires onChange callback with correct args');
        QUnit.ok(UIElements[1].classList.contains(selectedClass), 'second label ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first label ui element does NOT contain active class');
        QUnit.ok(!UIElements[2].classList.contains(selectedClass), 'third label ui element does NOT contain active class');
        // click third label
        labels[2].dispatchEvent(TestUtils.createEvent('click', {bubbles:true, cancelable: true}));
        QUnit.deepEqual(onChangeSpy.args[2], [inputs[2].value, inputs[2], UIElements[2]], 'clicking on third label, fires onChange callback with correct args');
        QUnit.ok(UIElements[2].classList.contains(selectedClass), 'third label ui element contains active class');
        QUnit.ok(!UIElements[0].classList.contains(selectedClass), 'first label ui element does NOT contain active class');
        QUnit.ok(!UIElements[1].classList.contains(selectedClass), 'second label ui element does NOT contain active class');
        instance.destroy();
    });

    QUnit.test('getElementKey()', function() {
        QUnit.expect(2);
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        var radios = wrapper.getElementsByClassName('ui-button-toggle-input');
        var instance = new ButtonToggle({inputs: radios});
        QUnit.equal(instance.getElementKey(), 'buttonToggleRadio', 'getElementKey() method was called and returned "buttonToggleRadio"');
        instance.destroy();
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        var checkboxes = wrapper.getElementsByClassName('ui-button-toggle-input');
        var instance = new ButtonToggle({inputs: checkboxes});
        QUnit.equal(instance.getElementKey(), 'buttonToggleCheckbox', 'getElementKey() method was called and returned "buttonToggleCheckbox"');
        instance.destroy();
    });

    QUnit.test('initializing when checked initially', function() {
        QUnit.expect(3);
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        inputs[0].checked = true; // make it so that input is checked initially
        var onSelectedSpy = Sinon.spy();
        var instance = new ButtonToggle({inputs: inputs});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        QUnit.equal(inputs[0].checked, true, 'first input\'s checked property returns true initially');
        QUnit.ok(UIElements[0].classList.contains(selectedClass), 'first ui element toggle has active class initially because original input was checked initially');
        QUnit.equal(onSelectedSpy.callCount, 0, 'onSelected callback was NOT fired');
        instance.destroy();
    });

    QUnit.test('enabling and disabling', function () {
        QUnit.expect(18);
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        var instance = new ButtonToggle({inputs: inputs});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        QUnit.ok(!UIElements[0].classList.contains(disabledClass), 'first toggle does not have active class initially');
        QUnit.ok(!inputs[0].disabled, 'first toggle input\'s disabled property returns falsy');
        QUnit.ok(!UIElements[1].classList.contains(disabledClass), 'second toggle does not have active class initially');
        QUnit.ok(!inputs[1].disabled, 'second toggle input\'s disabled property returns falsy');
        QUnit.ok(!UIElements[2].classList.contains(disabledClass), 'third toggle does not have active class initially');
        QUnit.ok(!inputs[2].disabled, 'third toggle input\'s disabled property returns falsy');
        instance.disable();
        QUnit.ok(UIElements[0].classList.contains(disabledClass), 'after calling disable(), first toggle does not have active class initially');
        QUnit.ok(inputs[0].disabled, 'first toggle input\'s disabled property returns truthy');
        QUnit.ok(UIElements[1].classList.contains(disabledClass), 'second toggle does not have active class initially');
        QUnit.ok(inputs[1].disabled, 'second toggle input\'s disabled property returns truthy');
        QUnit.ok(UIElements[2].classList.contains(disabledClass), 'third toggle does not have active class initially');
        QUnit.ok(inputs[2].disabled, 'third toggle input\'s disabled property returns truthy');
        instance.enable();
        QUnit.ok(!UIElements[0].classList.contains(disabledClass), 'after calling enable(), first toggle does not have active class initially');
        QUnit.ok(!inputs[0].disabled, 'first toggle input\'s disabled property returns falsy');
        QUnit.ok(!UIElements[1].classList.contains(disabledClass), 'second toggle does not have active class initially');
        QUnit.ok(!inputs[1].disabled, 'second toggle input\'s disabled property returns falsy');
        QUnit.ok(!UIElements[2].classList.contains(disabledClass), 'third toggle does not have active class initially');
        QUnit.ok(!inputs[2].disabled, 'third toggle input\'s disabled property returns falsy');
        instance.destroy();
    });

    QUnit.test('initializing when disabled initially', function() {
        QUnit.expect(2);
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        var inputs = wrapper.getElementsByClassName('ui-button-toggle-input');
        inputs[0].disabled = true; // disable input field initially
        var instance = new ButtonToggle({inputs: inputs});
        var UIElements = wrapper.getElementsByClassName('ui-button-toggle');
        QUnit.ok(inputs[0].disabled, 'first toggle input was disabled initially');
        QUnit.ok(UIElements[0].classList.contains(disabledClass), 'first toggle element has disabled class initially because original input was disabled initially');
        instance.destroy();
    });

    QUnit.test('getValue() should return the currently selected radio button\'s value', function() {
        QUnit.expect(2);
        var radioHtml = '' +
            '<div class="container">' +
            '<label><input type="radio" class="ui-button-toggle-input" value="AAPL" name="stocks" />Apple</label>' +
            '<label><input type="radio" class="ui-button-toggle-input" value="FB" name="stocks" />Facebook</label>' +
            '<label><input type="radio" class="ui-button-toggle-input" value="VZ" name="stocks" />Verizon</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var radios = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: radios});
        // click first toggle
        instance.select(1);
        QUnit.equal(instance.getValue(), radios[1].value, 'after selecting second toggle, getValue() returns second item\'s value');
        // click second toggle
        instance.select(2);
        QUnit.equal(instance.getValue(), radios[2].value, 'after selecting third toggle, getValue() returns third item\'s value');
        instance.destroy();
    });

    QUnit.test('getValue() should return all values of the currently selected checkboxes', function() {
        QUnit.expect(3);
        var checkboxHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" value="NY" name="state1" />New York</label>' +
            '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
            '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var checkboxes = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: checkboxes});
        QUnit.equal(instance.getValue(), '', 'calling getValue() when there is no currently set value returns empty string');
        // select first checkbox
        instance.select(0);
        var testArray = [checkboxes[0].value];
        QUnit.deepEqual(instance.getValue(), testArray, 'after selecting first toggle, getValue() returns an array with first item\'s value');
        // click second toggle
        instance.select(1);
        testArray.push(checkboxes[1].value);
        QUnit.deepEqual(instance.getValue(), testArray, 'after selecting second toggle, getValue() returns an array with first and second item\'s value');
        instance.destroy();
    });

    QUnit.test('getValue() should return an empty array if no checkboxes are selected', function() {
        QUnit.expect(1);
        var checkboxHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" value="NY" name="state1" />New York</label>' +
            '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
            '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var checkboxes = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: checkboxes});
        QUnit.deepEqual(instance.getValue(), []);
        instance.destroy();
    });

    QUnit.test('clear() should clear all checkbox button toggles', function() {
        QUnit.expect(1);
        var checkboxHtml = '' +
            '<div class="container">' +
                '<label><input type="checkbox" value="NY" name="state1" />New York</label>' +
                '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
                '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var checkboxes = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: checkboxes});
        instance.select(0); // select first toggle
        instance.select(1); // select second toggle
        instance.clear();
        QUnit.deepEqual(instance.getValue(), [], 'clear() returns empty array');
        instance.destroy();
    });

    QUnit.test('clear() should unselect the currently selected radio button toggle', function() {
        QUnit.expect(4);
        var checkboxHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" value="NY" name="state1" />New York</label>' +
            '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
            '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var radios = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: radios});
        // click second toggle
        instance.select(1);
        QUnit.equal(radios[1].checked, true, 'second item is original selected');
        // click third toggle
        instance.clear();
        QUnit.equal(radios[0].checked, false, 'after clear(), first item is not checked');
        QUnit.equal(radios[1].checked, false, 'second item is not checked');
        QUnit.equal(radios[2].checked, false, 'third item is not checked');
        instance.destroy();
    });

    QUnit.test('getValue() should return empty array when clear() method is called on checkboxes', function() {
        QUnit.expect(2);
        var checkboxHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" value="NY" name="state1" />New York</label>' +
            '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
            '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        document.getElementById('qunit-fixture').appendChild(wrapper);
        var radios = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: radios});
        // click second toggle
        instance.select(1);
        QUnit.equal(instance.getValue(), radios[1].value, 'second item is original selected');
        instance.clear();
        QUnit.deepEqual(instance.getValue(), [], 'after clear(), getValue() returns empty value');
        instance.destroy();
    });

    QUnit.test('should select the toggle element with a value that matches the value passed into setValue()', function() {
        QUnit.expect(6);
        var fixture = document.getElementById('qunit-fixture');
        var selectValue = 'FB';
        var radioHtml = '' +
            '<div class="container">' +
                '<label><input type="radio" class="ui-button-toggle-input" value="AAPL" name="stocks" />Apple</label>' +
                '<label><input type="radio" class="ui-button-toggle-input" value="' + selectValue + '" name="stocks" />Facebook</label>' +
                '<label><input type="radio" class="ui-button-toggle-input" value="VZ" name="stocks" />Verizon</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(radioHtml);
        fixture.appendChild(wrapper);
        var radios = wrapper.getElementsByTagName('input');
        var fbRadioInput = wrapper.querySelector('input[value="' + selectValue + '"]');
        var appRadioInput = wrapper.querySelector('input[value="AAPL"]');
        var vzRadioInput = wrapper.querySelector('input[value="VZ"]');
        var instance = new ButtonToggle({inputs: radios});
        QUnit.equal(fbRadioInput.checked, false);
        QUnit.equal(appRadioInput.checked, false);
        QUnit.equal(vzRadioInput.checked, false);
        instance.setValue(selectValue);
        QUnit.equal(fbRadioInput.checked, true, 'correct radio button is selected after passing its matching value to setValue()');
        QUnit.equal(appRadioInput.checked, false);
        QUnit.equal(vzRadioInput.checked, false);
        instance.destroy();
    });

    QUnit.test('should check all checkboxes that match the value of the options values passed in on initialize', function() {
        QUnit.expect(3);
        var val = 'NY';
        var checkboxHtml = '' +
            '<div class="container">' +
                '<label><input type="checkbox" value="MD" name="state2" />Maryland</label>' +
                '<label><input type="checkbox" value="' + val + '" name="state1" />New York</label>' +
                '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        var inputs = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: inputs, value: val});
        QUnit.equal(inputs[0].checked, false, 'first input\'s checked property returns false because its value doesnt match value passed in initialize options');
        QUnit.equal(inputs[1].checked, true, 'second input\'s checked property returns true initially because value was passed to options that matches it');
        QUnit.equal(inputs[2].checked, false, 'third input\'s checked property returns false because its value doesnt match value passed in initialize options');
        instance.destroy();
    });

    QUnit.test('should check all checkboxes that match the value of the options values passed in on initialize', function() {
        QUnit.expect(3);
        var val = 'NY';
        var val2 = 'MD';
        var checkboxHtml = '' +
            '<div class="container">' +
            '<label><input type="checkbox" value="' + val + '" name="state1" />New York</label>' +
            '<label><input type="checkbox" value="' + val2 + '" name="state2" />Maryland</label>' +
            '<label><input type="checkbox" value="DC" name="state3" />District Of Columbia</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(checkboxHtml);
        var inputs = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: inputs, value: [val, val2]});
        QUnit.equal(inputs[0].checked, true, 'first input\'s checked property returns true initially because value was passed to options that matches it');
        QUnit.equal(inputs[1].checked, true, 'second input\'s checked property returns true initially because value was passed to options that matches it');
        QUnit.equal(inputs[2].checked, false, 'third input\'s checked property returns false because its value doesnt match value passed in initialize options');
        instance.destroy();
    });

    QUnit.test('should check the radio button that matches the value of the options values passed in on initialize', function() {
        QUnit.expect(3);
        var val = 'FB';
        var html = '' +
            '<div class="container">' +
                '<label><input type="radio" value="AAPL" name="stocks" />Apple</label>' +
                '<label><input type="radio" value="' + val + '" name="stocks" />Facebook</label>' +
                '<label><input type="radio" value="VZ" name="stocks" />Verizon</label>' +
            '</div>';
        var wrapper = TestUtils.createHtmlElement(html);
        var inputs = wrapper.getElementsByTagName('input');
        var instance = new ButtonToggle({inputs: inputs, value: val});
        QUnit.equal(inputs[0].checked, false, 'first radio\'s checked property returns false because its value doesnt match value passed in initialize options');
        QUnit.equal(inputs[1].checked, true, 'second radio\'s checked property returns true initially because value was passed to options that matches it');
        QUnit.equal(inputs[2].checked, false, 'third radio\'s checked property returns false because its value doesnt match value passed in initialize options');
        instance.destroy();
    });

})();