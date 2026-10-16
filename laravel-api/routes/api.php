<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Current user
    |--------------------------------------------------------------------------
    */

    Route::get('/user', function (Request $request) {

        return $request->user();

    });

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );

    /*
    |--------------------------------------------------------------------------
    | Posts
    |--------------------------------------------------------------------------
    */

    Route::apiResource(
        'posts',
        PostController::class
    );

    Route::patch(
        'posts/{post}/status',
        [PostController::class, 'updateStatus']
    );

    /*
    |--------------------------------------------------------------------------
    | Comments
    |--------------------------------------------------------------------------
    */

    Route::apiResource(
        'posts.comments',
        CommentController::class
    );

    /*
    |--------------------------------------------------------------------------
    | Users / Roles
    |--------------------------------------------------------------------------
    */

    Route::post(
        'users/{user}/assign-role',
        [UserController::class, 'assignRole']
    );

    Route::post(
        'users/{user}/remove-role',
        [UserController::class, 'removeRole']
    );

});

/*
|--------------------------------------------------------------------------
| Test routes
|--------------------------------------------------------------------------
*/

Route::post('/test-post', function (Request $request) {

    return response()->json([
        'message' => 'Post received!',
        'data' => $request->all(),
    ]);

});

Route::post('/demo-posts', function (Request $request) {

    $data = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required',
    ]);

    $post = Post::create($data);

    return response()->json(
        $post,
        201
    );

});
