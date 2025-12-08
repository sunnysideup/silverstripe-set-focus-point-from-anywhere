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
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\Versioned\Versioned;
use Sunnysideup\PerfectCmsImages\Forms\PerfectCmsImagesUploadField;
use Sunnysideup\SetFocusPointFromAnywhere\Control\SetImageFocusFieldController;

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


    private static $allowed_actions = [
        'updatefocuspoint'
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

    // protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    protected $schemaComponent = 'FieldGroup';

    protected ?bool $detailsAdded = false;
    protected ?Image $image = null;

    public function __construct(string $name, ?string $title = null, ?Image $image = null)
    {
        $this->image = $image;
        if ($this->HasImage()) {
            $link = SetImageFocusFieldController::get_link_for_image($this->image);
            $focus = $this->image->dbObject('FocusPoint');
            $width = self::config()->get('max_width');
            $data = [
                'tabindex' => null,
                'type' => null,
                'value' => null,
                'data-width' => $this->image->getWidth(),
                'data-current-x' => $focus->getX(),
                'data-current-y' => $focus->getY(),
                'data-height' => $this->image->getHeight(),
                'data-id' => $this->image->ID,
                'data-update-url' => Director::absoluteURL($link),
                'class' => 'sunny-side-up-set-focus-point',
                'title' => ($this->tag === 'fieldset') ? null : $this->legend,
                'style' => 'width: ' . $width . 'px!important; overflow: visible;',
            ];
            $fields[] = (
                LiteralField::create(
                    'SetFocusPointDetails',
                    '<div ' . $this->arrayToAttributes($data) . '>
                        <img
                            src="' . $this->image->Link() . '"
                            alt="' . Convert::raw2att($this->image->Title) . '"
                            width="' . $width . '"
                        />
                        <div class="ssu-focus-marker"></div>
                    </div>'
                )
            );
        } else {
            $fields = [
                LiteralField::create(
                    'NoImageSelected' . random_int(0, 9999),
                    '<p class="help-block">No image selected. To set a focus point, please select an image first and then save the record.</p>'
                )
            ];
        }

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



    protected function HasImage()
    {
        return $this->image && $this->image->exists() && $this->image instanceof Image;
    }

    /**
     * Returns the form field.
     *
     * Although FieldHolder is generally what is inserted into templates, all of the field holder
     * templates make use of $Field. It's expected that FieldHolder will give you the "complete"
     * representation of the field on the form, whereas Field will give you the core editing widget,
     * such as an input tag.
     *
     * @param array $properties
     * @return DBHTMLText
     */
    public function Field($properties = []): DBHTMLText
    {

        return parent::Field($properties);
    }

    protected function arrayToAttributes(array $attributes)
    {
        $string = '';
        foreach ($attributes as $key => $value) {
            if ($value !== null) {
                $string .= ' ' . $key . '="' . Convert::raw2att($value) . '"';
            }
        }
        return $string;
    }
}
