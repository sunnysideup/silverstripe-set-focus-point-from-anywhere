<?php

namespace Sunnysideup\SetFocusPointFromAnywhere\Form;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetContainer;
use SilverStripe\Control\Director;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextField;
use Sunnysideup\PerfectCmsImages\Forms\PerfectCmsImagesUploadField;

/**
 * FocusPointField class.
 * Facilitates the selection of a focus point on an image.
 *
 * @extends FieldGroup
 */
class SetImageFocusField extends FieldGroup
{
    /**
     * Enable to view Focus X and Focus Y fields while in Dev mode.
     */
    private static bool $debug = false;

    /**
     * Maximum width of preview image
     */
    private static int $max_width = 300;

    /**
     * Maximum height of preview image
     */
    private static int $max_height = 150;

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    protected $schemaComponent = 'SetImageFocusField';

    protected ?Image $image = null;

    public function __construct(string $name, ?string $title = null, ?Image $image = null)
    {


        if ($image) {
            $this->image = $image;

            // Create the fields
            $fields = [
                LiteralField::create(
                    'FocusPointPreview',
                    '<div
                        class="sunny-side-up-set-focus-point"
                        data-image-width="' . $image->getWidth() . '"
                        data-image-height="' . $image->getHeight() . '"
                        data-image-id="' . $image->ID . '"
                        data-update-url="' . Director::absoluteURL('admin/updatefocuspoint/' . $image->ID) . '"
                    >
                        <img
                            src="' . $image->Link() . '"
                            alt="' . htmlspecialchars($image->Title, ENT_QUOTES) . '"
                        />
                    </div>'
                ),
                LiteralField::create(
                    'FocusPointInstructions',
                    '<p class="help-block">Click on the subject of the image to ensure it is not lost during cropping.</p>'
                )
            ];
        }

        $this->setName($name)->setValue('');

        parent::__construct($title, $fields);
    }

    public function getToolTip()
    {
        return _t(
            __CLASS__ . '.FieldToolTip',
            'Click on the subject of the image to ensure it is not lost during cropping'
        );
    }
}
