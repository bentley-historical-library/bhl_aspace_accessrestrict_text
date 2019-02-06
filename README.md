# BHL ASpace accessrestrict Text
This ArchivesSpace plugin adds functionality to automatically populate the text content of a Conditions Governing Access note based on selections made in the Local Access Restriction Type controlled value list and dates entered in the Restriction End date field.

## Directory Structure
    frontend\
        assets\
            accessrestrict.crud.js
        locales\
            enums\
                en.yml
        views\
            layout_head.html.erb

## How it Works
The bulk of the functionality of this plugin can be found in `frontend\assets\accessrestrict.crud.js`. This JavaScript file defines a function that is initialized every time a sub record is created or a container is expanded in the application (i.e., every time a new note is created or edited). The function checks to see if the note is of the type 'accessrestrict' (Conditions Governing Access) and, if so, it displays the note's text box, hides the note's mixed content editor, and updates the content of the text box every time a selection in the Local Access Restriction Type controlled value list is changed and every time a date entered in the Restriction End field is changed. The populated text takes the form of `[SELECTED OPTION]` when only a Local Access Restriction Type is selected, and `[SELECTED OPTION] until <date type="restriction" normal="[YYYY-MM-DD]">[Month day, year]</date>`, when both a Local Access Restriction Type is selected and a Restriction End Date is entered. `[YYYY-MM-DD]` is taken directly from the Restriction End field and `[Month day, year]` is formatted from that date. If the date entered is not of the form YYYY-MM-DD, then `[Month day, year]` will display the unformatted content of the Restriction End field. If multiple Local Access Restriction Types are selected, or if all selections are removed, the text box will be empty. 