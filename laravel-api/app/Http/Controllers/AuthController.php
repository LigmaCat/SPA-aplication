<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */

    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);

        $token = $user->createToken(
            $user->name
        );

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    */

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        $user = User::where(
            'email',
            $request->email
        )->first();

        if (
            ! $user ||
            ! Hash::check(
                $request->password,
                $user->password
            )
        ) {

            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        $token = $user->createToken(
            $user->name
        );

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    public function logout(Request $request)
    {
        $request->user()
            ->tokens()
            ->delete();

        return response()->json([
            'message' => 'You are logged out.',
        ]);
    }
}
