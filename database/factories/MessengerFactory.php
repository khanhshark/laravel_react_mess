<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Messenger>
 */
class MessengerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
            $sender_id  = $this->faker->randomElement([0,1]);
                if($sender_id ===0){
                    $sender_id = $this->faker->randomElement(\App\Models\User::where( 'id','!=',1  )->pluck('id')->toArray());
                    $receiver_id = 1;
                }
                else {
                    $receiver_id =$this->faker->randomElement(\App\Models\User::pluck('id')->toArray());
                }

                $groupId = null;
                if($this->faker->boolean(50)){
                    $groupId = $this->faker->randomElement(\App\Models\Group::pluck('id')->toArray());
                    //! chọn người gửi trong group
                    $group =\App\Models\Group::find($groupId);
                    $sender_id =$this->faker->randomElement($group->users->pluck('id')->toArray());
                    $receiver_id=null;
                }
                else{

                }


        return [
            //
            'sender_id' => $sender_id,
            'receiver_id' =>$receiver_id,
            'group_id' =>$groupId,
            'message'=>$this->faker->realText(200),
            'created_at'=>$this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
