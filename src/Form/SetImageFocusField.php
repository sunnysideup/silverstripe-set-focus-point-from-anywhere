<?php

namespace Sunnysideup\SetFocusPointFromAnywhere\Form;

use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetContainer;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextField;
use SilverStripe\Versioned\Versioned;
use Sunnysideup\PerfectCmsImages\Forms\PerfectCmsImagesUploadField;

/**
 * FocusPointField class.
 * Facilitates the selection of a focus point on an image.
 *
 * @extends FieldGroup
 */
class SetImageFocusField extends FieldGroup
{

    private static $url_handlers = [
        '$Action!/$ID' => '$Action'
    ];

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


        if ($image && $image->exists() && $image instanceof Image) {
            $this->image = $image;

            // Create the fields
            $fields = [
                LiteralField::create(
                    'FocusPointPreview' . $image->ID,
                    '<div
                        class="sunny-side-up-set-focus-point"
                        data-image-width="' . $image->getWidth() . '"
                        data-image-height="' . $image->getHeight() . '"
                        data-image-id="' . $image->ID . '"
                        data-update-url="' . Director::absoluteURL($this->Link('updatefocuspoint/' . $image->ID)) . '"
                    >
                        <img
                            src="' . $image->Link() . '"
                            alt="' . Convert::raw2att($image->Title) . '"
                        />
                    </div>'
                ),
                LiteralField::create(
                    'FocusPointInstructions',
                    '<p class="help-block">Click on the subject of the image to ensure it is not lost during cropping.</p>'
                )
            ];
        } else {
            $fields = [
                LiteralField::create(
                    'NoImageSelected' . random_int(0, 9999),
                    '<p class="help-block">No image selected. To set a focus point, please save the record and select an image first.</p>'
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



    /**
     * Get the whole tree of a part of the tree via an AJAX request.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     * @throws Exception
     */
    public function updatefocuspoint(HTTPRequest $request)
    {
        $id = (int) $request->param('ID');
        $x = (float) $request->getVar('x');
        $y = (float) $request->getVar('y');

        $image = Image::get()->byID($id);
        if ($image) {
            if ($image->canEdit()) {
                $message = $this->setFocusPoint($image, $x, $y);
            } else {
                $message = 'Permission denied.';
            }
        } else {
            $message = 'Image not found.';
        }
        $json = [
            'status' => ($message === 'OK') ? 'success' : 'error',
            'message' => $message,
        ];

        return HTTPResponse::create()
            ->addHeader('Content-Type', 'application/json')
            ->setBody(json_encode($json));
    }




    protected function setFocusPoint(Image $image, $x, $y)
    {
        $focusPoint = $image->dbField('FocusPoint');
        if ($image instanceof Image) {
            $isPublishedAndNotModified = $image->isPublished() && !$image->isModifiedOnDraft();
            if ($x > 1 || $x < -1) {
                $x = 0;
            }
            if ($y > 1 || $y < -1) {
                $y = 0;
            }
            $focusPoint->setValue(['X' => $x, 'Y' => $y]);
            $image->writeToStage(Versioned::DRAFT);
            if ($isPublishedAndNotModified) {
                $image->publishSingle();
            }

            return 'OK';
        }
        return 'Not an image.';
    }
}
