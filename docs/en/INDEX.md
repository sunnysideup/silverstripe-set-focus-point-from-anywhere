# tl;dr

This module allows you to set a focus point from anywhere.  The reason we created this was because the original focus point module (as amazing as it is), was not working so well (UX wise) in some situations (too many clicks). 


Here is how you can use the field: 

```php

namespace MyCompany\App;

use Sunnysideup\SetFocusPointFromAnywhere\Form\SetImageFocusField;


class ImageBlock extends DataObject (or BaseElement or whatever)
{

    private static $has_one = [
        'MyImage' => Image::class,
    ];

    private static $owns = [
        'MyImage',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $myImage = $this->MyImage();
        if ($myImage && $myImage->exists()) {
            $fields->addFieldToTab(
                'Root.Main',
                SetImageFocusField::create('MyImageFocus', 'Select area that should always be visible', $myImage)
            );
        }

        return $fields;
    }

}
```


