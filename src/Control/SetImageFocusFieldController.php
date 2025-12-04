<?php

namespace Sunnysideup\SetFocusPointFromAnywhere\Control;

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
class SetImageFocusFieldController extends Controller
{
    private static array $allowed_actions = [
        'updatefocuspoint',
    ];

    public function updatefocuspoint(HTTPRequest $request)
    {
        $id = $request->param('ID');
        $x = $request->getVar('x');
        $y = $request->getVar('y');

        $image = Image::get()->byID($id);
        $focusPoint = $image->dbField('FocusPoint');
        if ($image instanceof Image) {
            $isPublishedAndNotModified = $image->isPublished() && !$image->isModified();
            $focusPoint->setValue(['X' => $x, 'Y' => $y]);
            $image->writeToStage(Versioned::DRAFT);
            if ($isPublishedAndNotModified) {
                $image->publishSingle();
            }

            return 'Focus point updated successfully.';
        }

        return 'Image not found.';
    }
}
