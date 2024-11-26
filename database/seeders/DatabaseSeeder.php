<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Messenger;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Conversation;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'test@example.com',
            'password'=>bcrypt('password'),
            'is_admin' =>true
        ]);
        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password'=>bcrypt('password'),
            
        ]);
        User::factory(10)->create();
        for($i = 0; $i < 5; $i++){
            $group = Group::factory()->create(['owner_id' =>1]); 
            $user = User::inRandomOrder()->limit(rand(2,5))->pluck('id'); //! tạo ngẫu nhiêu 1 số lượng người dùng
            $group->users()->attach(array_unique([1,...$user])); //! gán người dùng vào nhóm 
        }
        Messenger::factory(1000)->create();
        $message  = Messenger::whereNull('group_id')->orderBy('created_at')->get();
        //! lệnh này nhóm mesage lại thành dạng xét các group_id là null và nhóm lại theo định dạng
        /**
         *  [1  2]
         *            ===> 1_2
         * [2 1]
         * 
         */
        $conversation = $message->groupBy(function($message){
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');

        })->map(function($groupedMessages){

            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values(); //! values bỏ đi cái chỉ mục :
        
         
        /* 
        
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver,
 1-2 =>         'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'update_at' => new Carbon(),
            
        */

        Conversation::insertOrIgnore($conversation->toArray());
       
    }
}
