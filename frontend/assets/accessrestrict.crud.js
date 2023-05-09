$(function() {

    var apply_accessrestrict_text = function(subform) {
        var $subform = $(subform);
        var $note_type = $("select.note-type" , $subform);
        var $textarea = $(":input[id*='_content_']", $subform);
        var $editor = $(".CodeMirror", $subform);
        if ($note_type.val() === "accessrestrict") {
            $textarea[0].removeAttribute("style");
            $editor[0].setAttribute("style", "display: none;");
        }

        var $local_access_restriction_type = $("select[id*='_local_access_restriction_type_']", $subform);
        var $restriction_end_field = $(":input[id*='_rights_restriction__end_']", $subform);
        
        var update_accessrestrict_text = function($local_access_restriction_type, $restriction_end_field) {
            var $selected_types = $local_access_restriction_type.val();
            if ($selected_types === null) {
                var $restriction_type = "";
            } else if ($selected_types.length === 1) {
                var $restriction_type = $local_access_restriction_type.find("option:selected").text();
            } else {
                var $restriction_type = "";
            }

            var $restriction_end_date = $restriction_end_field[0].value;

            if ($restriction_type != "" && $restriction_end_date != "") {
                if (/^\d{4}\-\d{2}\-\d{2}$/.test($restriction_end_date)) {
                    var $dateParts = $restriction_end_date.split("-");
                    var $date = new Date($dateParts[0], $dateParts[1]-1, $dateParts[2]);
                    var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
                    var $full_date = monthName($date) + " " + $date.getDate() + ", " + $date.getFullYear();
                    var $accessrestrict_text = $restriction_type + ' until <date type="restriction" normal="' + $restriction_end_date + '">' + $full_date + "</date>";
                } else {
                    var $accessrestrict_text = $restriction_type + ' until <date type="restriction" normal="' + $restriction_end_date + '">' + $restriction_end_date + "</date>";
                }
            } else if ($restriction_type != "") {
                var $accessrestrict_text = $restriction_type;
            } else {
                var $accessrestrict_text = "";
            };
            $textarea[0].value = $accessrestrict_text;

        };

        $restriction_end_field.change(function() {
            update_accessrestrict_text($local_access_restriction_type, $restriction_end_field);
        });
        $local_access_restriction_type.change(function() {
            update_accessrestrict_text($local_access_restriction_type, $restriction_end_field)
        });

    };

    $(document).bind("subrecordcreated.aspace", function(event, object_name, subform) {
        if (object_name === "note") {
            // BEGIN: ArchivesSpace layout workaround
            //
            // ArchivesSpace has a bug that causes the local access restriction
            // select box to be jammed up against the left margin.  It looks bad.
            // Once that's fixed upstream the following workaround can be
            // removed.

            var $local_access_restriction_type = $("select[id*='_local_access_restriction_type_']", $(subform));
            var $control = $local_access_restriction_type.closest('.control-group');

            if ($control.parent().attr('id') === 'notes_restriction') {
                // Add a form-group to fix the layout
                var $group = $('<div class="form-group"><div class="col-sm-2 control-label"></div><div class="col-sm-4"></div></div>');
                $group.insertBefore($control);

                $group.find('.col-sm-4').append($control.find('.controls'))
                $group.find('.col-sm-2').append($control.find('label'))

                $group.find('.help-inline').css('display', 'block');
            }
            // END: ArchivesSpace layout workaround

            apply_accessrestrict_text($(subform));
        }
    });

    $(document).bind("expandcontainer.aspace", function(event, $container) {
        apply_accessrestrict_text($container);
    });
});
