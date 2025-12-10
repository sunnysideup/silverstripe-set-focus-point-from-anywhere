# tl;dr

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

