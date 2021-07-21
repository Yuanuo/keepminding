import { I18n } from "../core/i18n";

export function shortcutDialog() {
    let html = `
  <div class="modal-body shortcut-dialog ng-scope">
    <!-- ngRepeat: group in shortcut -->
    <section ng-repeat="group in shortcut" class="ng-scope">
      <h3 class="ng-binding">${I18n.V("dShortcut_NodeOperation")}</h3>
      <!-- ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Enter">Enter</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_InsertSiblingNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Tab">Tab</span>,
          <span class="shortcut-key" title="Insert">Insert</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_InsertChildNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Shift">Shift</span> +
          <span class="shortcut-key" title="Tab">Tab</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_InsertParentNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Delete">Delete</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_RemoveNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Up">Up</span>,
          <span class="shortcut-key" title="Down">Down</span>,
          <span class="shortcut-key" title="Left">Left</span>,
          <span class="shortcut-key" title="Right">Right</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_Navigation")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Alt">Alt</span> +
          <span class="shortcut-key" title="Up">Up</span>,
          <span class="shortcut-key" title="Down">Down</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_ReorderNodeUpDown")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="/">/</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_ExpandOrCollapse")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="F2">F2</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_EditNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Shift">Shift</span> +
          <span class="shortcut-key" title="Enter">Enter</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_TextNewline")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="A">A</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_SelectAll")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="C">C</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_CopyNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="X">X</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_CutNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="V">V</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_PasteNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="B">B</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_Bold")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="I">I</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_Italic")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="F">F</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_FindNode")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
    </section>
    <!-- end ngRepeat: group in shortcut -->
    <section ng-repeat="group in shortcut" class="ng-scope">
      <h3 class="ng-binding">${I18n.V("dShortcut_ScopeControl")}</h3>
      <!-- ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Alt">Alt</span> +
          <span class="shortcut-key" title="${I18n.V("dShortcut_Drag")}">${I18n.V("dShortcut_Drag")}</span>,
          <span class="shortcut-key" title="${I18n.V("dShortcut_DragWithMouseRight")}"
            >${I18n.V("dShortcut_DragWithMouseRight")}</span
          ></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_DragScope")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="${I18n.V("dShortcut_Mousewheel")}">${I18n.V("dShortcut_Mousewheel")}</span>,
          <span class="shortcut-key" title="${I18n.V("dShortcut_Touchpad")}">${I18n.V("dShortcut_Touchpad")}</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_MoveScope")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="${I18n.V("dShortcut_DblClickOnSpace")}"
            > ${I18n.V("dShortcut_DblClickOnSpace")}</span
          >, <span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="Enter">Enter</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_PlaceRootOnCentral")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="+">+</span>,
          <span class="shortcut-key" title="-">-</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_ZoomScope")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
    </section>
    <!-- end ngRepeat: group in shortcut -->
    <section ng-repeat="group in shortcut" class="ng-scope">
      <h3 class="ng-binding">${I18n.V("dShortcut_Layout")}</h3>
      <!-- ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="Shift">Shift</span> +
          <span class="shortcut-key" title="L">L</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_PutLayoutInOrder")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
    </section>
    <!-- end ngRepeat: group in shortcut -->
    <section ng-repeat="group in shortcut" class="ng-scope">
      <h3 class="ng-binding">${I18n.V("dShortcut_Regrets")}</h3>
      <!-- ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="Z">Z</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_Undo")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
      <div class="shortcut-group ng-scope" ng-repeat="k in group.groupItem">
        <span
          class="shortcut ng-binding"
          ng-bind-html="genKeyDOM(k.key) | trusted"
          ><span class="shortcut-key" title="Ctrl">Ctrl</span> +
          <span class="shortcut-key" title="Y">Y</span></span
        >
        <span class="description ng-binding"> ${I18n.V("dShortcut_Redo")}</span>
      </div>
      <!-- end ngRepeat: k in group.groupItem -->
    </section>
    <!-- end ngRepeat: group in shortcut -->
  </div>
  `;

    bootbox.dialog({
        title: I18n.V("dShortcut"),
        message: html
    });
}
