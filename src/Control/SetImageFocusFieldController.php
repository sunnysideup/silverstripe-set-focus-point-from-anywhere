<?php

namespace Sunnysideup\SetFocusPointFromAnywhere\Control;

use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetContainer;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Config\Config;
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
class SetImageFocusFieldController extends Controller
{
    private static string $url_segment = 'admin/set-image-focus-point';

    public static function get_link_for_image($image): string
    {
        return Director::baseURL() . Config::inst()->get(self::class, 'url_segment') . '/updatefocuspoint/' . $image->ID . '/';
    }

    private static array $allowed_actions = [
        'updatefocuspoint',
    ];

    public function updatefocuspoint(HTTPRequest $request)
    {
        $id = (int) $request->param('ID');
        $x = (float) $request->getVar('x');
        $y = (float) $request->getVar('y');

        $image = Image::get()->byID($id);
        if ($image) {
            if ($image->canEdit()) {
                return $this->setFocusPoint($image, $x, $y);
            }
            return 'Permission denied.';
        }

        return 'Image not found.';
    }


    protected function setFocusPoint(Image $image, $x, $y)
    {
        $focusPoint = $image->dbObject('FocusPoint');
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
